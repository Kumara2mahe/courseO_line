
# Django
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib import auth
from django.contrib.auth.models import User
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.utils.http import urlencode

# Local Django
from .models import VerificationOtp
from common.utils import showError, getPreviousUrl, getlinks, sendMail
from .utils import generatePassword, validatePassword

LOGIN_PATH = "/administrator/login"


def login(request):
    """ View for rendering Login-Page and authenticate Admin """

    # Get previous url from session
    previous_url = getPreviousUrl(request, default="/")

    if request.method == "POST":
        admin_name = request.POST["adminname"]
        pass_word = request.POST["password"]

        if admin_name == "" or pass_word == "":
            return JsonResponse({"info": "empty",
                                 "message": "Fields can't be empty"})

        # Validating credentials
        if (user := auth.authenticate(username=admin_name, password=pass_word)) is not None:

            # Login User
            auth.login(request, user)
            return JsonResponse({"info": "logged",
                                 "url": previous_url})

        return JsonResponse({"info": "invalid",
                             "message": "Credentials Invalid, please check"})

    elif request.user.is_authenticated:
        return redirect(previous_url)

    return render(request, "login.html")


@login_required(login_url=LOGIN_PATH)
def signup(request):
    """ View for rendering SignUp-Page """

    if request.method == "POST":
        admin_name = request.POST["adminname"]
        admin_email = request.POST["email"]

        # Validating credentials
        if admin_name == "" or admin_email == "":
            return JsonResponse({"info": "empty",
                                 "message": "Fields can't be empty"})

        elif User.objects.filter(username=admin_name).exists() or User.objects.filter(email=admin_email).exists():
            return JsonResponse({"info": "exists",
                                 "message": "Username and Email must be unique, try another one."})

        # Generate password & creating new user
        newpassword = generatePassword(12)
        newuser = User.objects.create_user(username=admin_name, email=admin_email,
                                           password=newpassword, is_staff=True)
        newuser.save()

        # Filling password with content and Sending as mail
        sitelinks = getlinks(request, True)
        mailcontent = {
            "username": admin_name,
            "password": newpassword,
        }
        response = sendMail(to=admin_email, as_="password",
                            **mailcontent, **sitelinks)
        return JsonResponse(response)

    return render(request, "signup.html")


def resetPassword(request):
    """ View for rendering ResetPassword-Page """

    # Get previous url from session
    previous_url = getPreviousUrl(request, default="/")

    if request.user.is_authenticated:
        return redirect(previous_url)
    else:
        response = render(request, "resetpassword.html")
        if (email := request.GET.get("email")):

            # Validating email and checking for otp expirated
            if (hasotp := VerificationOtp.objects.filter(email=email).first()) is None:
                response = HttpResponseRedirect(reverse("reset-password"))
            elif not ((after := hasotp.isblocked()) is None or after == "noremains") or hasotp.isexpired() == "noremains":
                response = HttpResponseRedirect(reverse("reset-password"))
        return response


@require_POST
def sendOtp(request):
    """ View to validate email and send otp through mail """

    msg = "sent"
    email = request.POST["registeredemail"]
    if email == "":
        return JsonResponse({"info": "empty",
                             "message": "Oops! your forgot to enter your Email"})

    elif (validuser := User.objects.filter(email=email).first()) is None:
        return JsonResponse({"info": "invalid",
                            "message": "Enter your registered Email to receive OTP!"})

    elif (previousotp := VerificationOtp.objects.filter(email=email).first()) is None:
        previousotp = VerificationOtp.objects.create(email=email,
                                                     username=validuser.username,
                                                     otp=VerificationOtp.randotp(),
                                                     expires_on=VerificationOtp.calculateExpire())

    elif (after := previousotp.isblocked()) is None and previousotp.attemptleft > 0 or (after is not None and after == "noremains"):
        previousotp.update()
        msg = msg if after else "resent"

    else:
        return JsonResponse({"info": "blocked",
                            "message": f"OTP verification limit exceeds, you can try again after {after}"})

    # Filling otp with content and Sending as mail
    sitelinks = getlinks(request, True)
    mailcontent = {
        "username": previousotp.username,
        "otp": previousotp.otp,
        "msg": msg,
        "email": urlencode({"email": email})
    }
    response = sendMail(to=email, as_="otp", **mailcontent, **sitelinks)
    return JsonResponse(response)


@require_POST
def checkOtp(request):
    email = request.POST["email"]
    enteredotp = request.POST["enteredotp"]

    if (hasotp := VerificationOtp.objects.filter(email=email).first()) is not None:
        if ((after := hasotp.isblocked()) is None or after == "noremains") and hasotp.attemptleft > 0 and hasotp.isexpired() != "noremains":
            if hasotp.otp == enteredotp:
                return JsonResponse({"info": "matched",
                                    "message": "Entered OTP is matched"})

            hasotp.updatelastfields()
            return JsonResponse({"info": "nomatch",
                                "message": "OTP doesn't match"})
        return JsonResponse({"info": "exceeds",
                             "message": f"OTP verification limit exceeds, you can try again after {after}"})
    return JsonResponse({"info": "error",
                         "message": "We doesn't sent any OTP to the email, you are requesting"})


def updatePassword(request):
    password = request.POST["newpassword"]
    password2 = request.POST["confirmpassword"]
    email = request.POST["email"]

    if password == "" or password2 == "":
        return JsonResponse({"info": "empty",
                             "message": "Password Fields can't be left empty"})

    elif (hasError := validatePassword(password=password, minlength=8, hasUpper=True, hasSymbol=True, password2=password2)) is None:
        if (user := User.objects.filter(email=email).first()) is not None:
            user.set_password(password)
            user.save()
            if (hasotp := VerificationOtp.objects.filter(email=email).first()) is not None:
                hasotp.delete()

            return JsonResponse({"info": "updated",
                                 "message": "Password has been Changed",
                                 "url": LOGIN_PATH})
        return JsonResponse({"info": "error",
                             "message": "We doesn't sent any OTP to the email, you are requesting"})
    return JsonResponse({"info": "invalid",
                         "message": hasError})


def logout(request):
    """ View for logging out current admin and redirect to previous page,
    which has don't require admin authentication """

    # Get previous url from session
    previous_url = getPreviousUrl(request, False, default="/")

    if not (previous_url and request.user.is_authenticated):
        return showError(request, 400)

    # Logout user
    auth.logout(request)
    return redirect(previous_url)


def redirectOrClose(request):
    """ View for redirecting to Login-Page / any previous-page"""

    if request.path == "/administrator/close":

        # Get previous url from session
        to_url = getPreviousUrl(request, default="/")

        if to_url is None:
            to_url = "/"
    else:
        to_url = LOGIN_PATH

    return redirect(to_url)
