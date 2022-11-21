from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib import auth
from django.utils.datastructures import MultiValueDictKeyError
from courseWebsite.models import AppCredential, CourseCategory, OurCourse
from django.contrib.auth.decorators import login_required


# importing random and string for generating OTP
import random
import string

# importing smtplib for sending mail
import smtplib

# importing os for deleting the old Pdf when uploading a new one
import os

# importing requests to check the user entered youtube url is valid or not
import requests


# -----------------------------------------------------------------------------------------


# Function for loading Home page
def home(request):

    # Selecting random names for placeholder Images
    image_names = ["vid_01", "vid_02", "vid_03", "vid_04"]
    random.shuffle(image_names)
    image_name = random.choice(image_names)

    # Calling the function for getting some random courses for Footer's Topics Section and also for HomePage
    footerTOpics()

    # Resetting the adminInterface
    resetingInterface()

    # Getting the all the courses from the database
    courses_in_database = OurCourse.objects.all()

    homecourses = []
    for course in courses_in_database:
        homecourses.append(course)

    random.shuffle(homecourses)

    # Sending the Course Details for HomePage
    home_courses = []

    if homecourses:
        course_detail_count = 0
        while (course_detail_count <= 3):
            home_courses.append(homecourses[course_detail_count])
            course_detail_count += 1

    # Sending the Course Categories for the HomePage
    home_categories = []

    if ourcourses:
        category_count = 0
        while (category_count <= 7):
            home_categories.append(ourcourses[category_count])
            category_count += 1

    return render(request, "home.html", {"home_courses": home_courses, "categories": home_categories, "image_name": image_name, "footer_topics": footer_topics})


# Function for loading About page
def about(request):

    # Overwriting urlpath with newvalue
    global previousUrl
    previousUrl = "/about"

    # Calling the function for getting some random courses for Footer's Topics Section and also for HomePage
    footerTOpics()

    return render(request, "about.html", {"footer_topics": footer_topics})


# Function for loading Courses page
def courses(request):

    # Overwriting urlpath with newvalue
    global previousUrl
    previousUrl = "/courses"

    # Getting all the course categories from the database
    course_categories = CourseCategory.objects.all().order_by("category_name").values()

    # Getting all the courses from the database
    course_details = []
    for category in course_categories:

        course_details.append(OurCourse.objects.filter(
            course_category=category["category_name"]))

    course_we_offer = zip(course_details, course_categories)

    # Calling the function for getting some random courses for Footer's Topics Section and also for HomePage
    footerTOpics()

    # Selecting random names for placeholder Images
    image_names = ["vid_01", "vid_02", "vid_03", "vid_04"]
    random.shuffle(image_names)
    image_name = random.choice(image_names)

    return render(request, "courses.html", {"categories": course_categories, "courses": course_we_offer, "image_name": image_name, "footer_topics": footer_topics})


# Function for loading Contact page
def contact(request):

    # Overwriting urlpath with newvalue
    global previousUrl
    previousUrl = "/contact"

    # Calling the function for getting some random courses for Footer's Topics Section and also for HomePage
    footerTOpics()

    return render(request, "contact.html", {"footer_topics": footer_topics})


# Function for loading Admin-Login page
def login(request):

    if request.method == "POST":

        # Getting the Values of Admin SignUp Panel
        global admin_name
        global pass_word
        admin_name = request.POST["adminname"]
        pass_word = request.POST['password']

        # Checking the Values of Admin SignUp Panel with database
        user = auth.authenticate(username=admin_name, password=pass_word)

        if user is not None:
            auth.login(request, user)

            # Getting the url of where login page is called and creating a list with it
            successMessage = ("Success", previousUrl)
            return JsonResponse({"message": list(successMessage)})

        elif admin_name == "" or pass_word == "":

            if admin_name == "" and pass_word != "":
                emptyMessage = ("User Id can't be empty", 0)

            elif admin_name != "" and pass_word == "":
                emptyMessage = ("Password can't be empty", 0)

            else:
                emptyMessage = ("Fields can't be empty", 0)

            return JsonResponse({"message": list(emptyMessage)})

        elif user is None:

            # Getting the userid from database
            userid = User.objects.filter(username=admin_name)

            # Validating with the user entered userId
            try:
                if str(userid[0]) != str(admin_name):
                    invalidMessage = ("User Id Invalid, please check", 0)

                elif str(userid[0]) == str(admin_name):
                    invalidMessage = ("Password Invalid, please check", 0)

            except IndexError:
                invalidMessage = ("User Id Invalid, please check", 0)

            return JsonResponse({"message": list(invalidMessage)})

    else:

        # Checking the Values of Admin SignUp Panel with database
        user = auth.authenticate(username=admin_name, password=pass_word)

        if user is not None:

            return redirect("/admin-settings")

        elif user is None:
            return render(request, "login.html")


# Function for loading Create Account Page
@login_required
def signup(request):

    # Function for generating random password
    def passwordGenerator():

        # Symbols used in password
        our_symbols = ["$", "@", "%", "&", "*"]
        random.shuffle(our_symbols)

        # Generating new Password for the New Admin Account
        passwod = random.choice(string.ascii_uppercase)

        # Generating random alphabets
        counter = len(passwod)
        while counter < 6:

            passwod += random.choice(string.ascii_lowercase)
            counter += 1

        # Generating random symbols
        passwod += random.choice(our_symbols)

        # Generating random numbers
        while counter < 9:

            passwod += random.choice(string.digits)
            counter += 1

        return passwod

    if request.method == "POST":

        # Getting the values of Create Admin Form
        new_admin_name = request.POST["newadminname"]
        new_email = request.POST["newemail"]

        if new_admin_name == "" or new_email == "":

            # Returing a error message when empty field / fields
            emptyMessage = ("Fields can't be empty", 0)
            return JsonResponse({"message": list(emptyMessage)})

        else:

            if User.objects.filter(username=new_admin_name).exists():

                # Returing a error message when adminId already exists
                userExists = ("UserName already exists", 0)
                return JsonResponse({"message": list(userExists)})

            elif User.objects.filter(email=new_email).exists():

                # Returing a error message when admin's EmailId already exists
                emailExists = ("Email Id already exists", 0)
                return JsonResponse({"message": list(emailExists)})

            else:

                # Calling the function for generating password
                password_generated = passwordGenerator()

                # Creating new user with the details got from form
                new_user = User.objects.create_user(
                    username=new_admin_name, email=new_email, password=password_generated, is_staff=True)
                new_user.save()

                # Starting the smpt server for gmails
                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()

                # Getting this app's email and password
                ourcredentials = (AppCredential.objects.all()).values()

                # Logging in to the sender email
                sender = ourcredentials[0]["app_email"]
                server.login(sender, ourcredentials[0]["app_password"])

                # Filling the Message content with the data received from the admin
                messsage = "From: course_Oline %s\nTo: Our admin %s\nSubject: courseOline Admin-Account Successfully Created\n\nYour UserId : %s \nPassword : %s" % (
                    sender, new_email, str(new_admin_name), str(password_generated))

                # Sending that message as an email to the admin's email
                server.sendmail(sender, new_email, messsage)

                # Returning a success message with the status
                successMessage = (
                    "'" + str(new_admin_name) + "' created<br>password Sent to email", 0)

                return JsonResponse({"message": list(successMessage)})

    else:
        return render(request, "signup.html")


# Function for closing the Admin-Login page
def closeAdminLogin(request):

    return redirect(previousUrl)


# Function for sending OTP as an email
def emailOTP(receiver, otp):

    # Starting the smpt server for gmails
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    # Getting this app's email and password
    ourcredentials = (AppCredential.objects.all()).values()

    # Logging in to the sender email
    sender = ourcredentials[0]["app_email"]
    server.login(sender, ourcredentials[0]["app_password"])

    # Filling the Message content with the data received from the admin
    message = "From: course_Oline %s\nTo: Our user %s\nSubject: Password Verification code : %s\nYour OTP is %s" % (
        sender, receiver, otp, otp)

    # Sending that message as an email to the admin's email
    server.sendmail(sender, receiver, message)


# Function for Validating the admin's email
def checkEmail(request):

    if request.method == "POST":

        # Getting the email from Admin Reset Password Panel
        global reset_email
        reset_email = request.POST["resetemail"]

        global validate_email
        validate_email = ""
        try:
            # Checking the email Admin Reset Password Panel with database
            validate_email = str((User.objects.filter(email=reset_email))[0])
            validating = "exists"

        except IndexError:
            validating = "notexists"

        if reset_email == "":

            emptyMessage = (
                "Oops! your forgot to enter your Email", 0)
            return JsonResponse({"message": list(emptyMessage)})

        else:

            if validating == "notexists":

                invalidMessage = (
                    "Please enter your registered email", "notexists")

            elif validating == "exists":

                # Creating a OTP with random numbers
                otp_pin = ""
                for i in range(6):
                    otp_pin += random.choice(string.digits)

                # Calling the function for sending this otp as mail
                emailOTP(reset_email, otp_pin)

                # Giving a message to the json
                invalidMessage = ("OTP sent successfully", otp_pin)

            else:
                invalidMessage = (
                    "Sorry! this is ours, try again.", 0)

            return JsonResponse({"message": list(invalidMessage)})

    else:
        return redirect("/admin-login")


# Function for checking and update admin's old password with new one
def passwordUpdater(request):

    if request.method == "POST":

        symbols = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*",
                   "(", ")", "_", "-", "+" "=", "{", "[", "}", "]", "|", "\\", ":", ";", "\"", "'", "<", ",", ">", ".", "?", "/"]

        # Getting the passwords from Admin Reset Password Panel
        new_password = request.POST["newpassword"]
        confirm_password = request.POST["confirmpassword"]

        if new_password == "" or confirm_password == "":

            emptyMessage = ("Fields can't be empty", 0)
            return JsonResponse({"message": list(emptyMessage)})

        else:

            if new_password.isdigit():

                passwordError = (
                    "Password should n't have only numbers", 0)
                return JsonResponse({"message": list(passwordError)})

            elif new_password.isalpha():

                passwordError = (
                    "Password should n't have only alphabets", 0)
                return JsonResponse({"message": list(passwordError)})

            elif new_password.isspace():

                passwordError = (
                    "Password shouldn't have spaces", 0)
                return JsonResponse({"message": list(passwordError)})

            uppercase = ""
            for word in new_password:
                if word.isupper():
                    uppercase = "true"
                    break
                else:
                    uppercase = "false"

            if uppercase == "true":

                condition = ""
                for symbol in symbols:
                    if condition == "success":
                        break

                    else:
                        for value in new_password:

                            if value == symbol:
                                condition = "success"
                                break
                            else:
                                condition = "failed"

                if condition == "success":

                    if len(new_password) < 8:

                        passwordError = (
                            "Password must contain minimum 8 characters", 0)
                        return JsonResponse({"message": list(passwordError)})

                    else:
                        if new_password == confirm_password:

                            # Getting the current user data
                            current_user = User.objects.get(
                                username__exact=validate_email)

                            # Setting the new password for the user
                            current_user.set_password(confirm_password)
                            current_user.save()

                            successMessage = (
                                "Password Changed", "/admin-login")
                            return JsonResponse({"message": list(successMessage)})

                        else:
                            passwordError = (
                                "Passwords doesn't match", 0)
                            return JsonResponse({"message": list(passwordError)})

                else:

                    passwordError = (
                        "Password must atleast have one symbol", 0)
                    return JsonResponse({"message": list(passwordError)})

            else:

                passwordError = (
                    "Password must atleast contain one uppercase letter", 0)
                return JsonResponse({"message": list(passwordError)})

    else:
        return redirect("/admin-login")


# Function for resetting the Admin Interface
def resetingInterface():

    global interfaces
    # Reseting values for activating Admin Inteface
    interfaces = {
        "addinterface": "preview",
        "updateinterface": "",
        "deleteinterface": ""
    }


# Function for loading Admin-Settings page
@login_required
def adminSettings(request):

    # Getting all the course categories from the database
    categories_list = CourseCategory.objects.all().order_by("category_name")
    # print(categories_list)

    if request.method == "POST":

        # Getting the value of confirmation form input
        which_form = request.POST["whichform"]

        # Confirming the POST method belongs to Add Course Form
        if which_form == "Add":

            # Getting the values of Add Course Form
            new_course_title = request.POST["newcoursetitle"]
            new_course_category = request.POST["newcoursecategory"]
            new_course_link = request.POST["newcourselink"]

            if new_course_title == "" or new_course_category == "" or new_course_link == "":

                emptyMessage = ("Fields can't be empty", 0)
                return JsonResponse({"message": list(emptyMessage)})

            else:

                # Getting only the finally random string from the url
                link_values = str(new_course_link).split("/")

                # Checking the entered youtube url really exists or not
                webpage = requests.get("https://youtu.be/" +
                                       str(link_values[len(link_values)-1]))

                pattern = '"playabilityStatus":{"status":"ERROR","reason":"Video unavailable"'
                if pattern in webpage.text:

                    errorMessage = (
                        "Please, enter a valid Youtube Link", 0)

                    return JsonResponse({"message": list(errorMessage)})

                else:
                    # Changing the user entered link into a embeded link
                    link_values = str(new_course_link).split("/")
                    new_course_link = "https://www.youtube.com/embed/" + \
                        str(link_values[len(link_values)-1])

                    # Changing the user entered values to the desired format
                    new_course_title = new_course_title.title()
                    new_course_category = new_course_category.title()

                    # Checking if the category already available in database or not
                    our_categorys = CourseCategory.objects.all()

                    new_category = new_course_category.replace(
                        " ", "").capitalize()
                    for category in our_categorys:

                        if new_category == str(category):
                            catergory_status = "exists"
                            break
                        else:
                            catergory_status = "new"

                    # Confirming whether the category entered is new or not
                    if catergory_status == "new":

                        try:

                            # Getting the image file from the form if one exists
                            new_course_category_image = request.FILES["newcoursecategoryimage"]

                            # Storing the Category's name and image to the database
                            CourseCategory.objects.create(
                                category_name=new_course_category,
                                category_image=new_course_category_image
                            )

                            try:

                                # Getting the pdf file from the form if one exists
                                new_course_pdf = request.FILES["newcoursepdf"]

                                # Storing the Course and details in the database with pdf file
                                OurCourse.objects.create(
                                    course_title=new_course_title,
                                    course_category=new_course_category,
                                    course_link=new_course_link,
                                    course_pdf=new_course_pdf
                                )

                            except MultiValueDictKeyError:

                                # Storing the Course and details in the database without pdf file
                                OurCourse.objects.create(
                                    course_title=new_course_title,
                                    course_category=new_course_category,
                                    course_link=new_course_link
                                )

                            finally:
                                successMessage = (
                                    "Course Added Successfully", 0)

                                return JsonResponse({"message": list(successMessage)})

                        except MultiValueDictKeyError:

                            # Throws this error when the image field is empty
                            errorMessage = (
                                "You forgot to add Category Image", 0)

                            return JsonResponse({"message": list(errorMessage)})

                    elif catergory_status == "exists":

                        # Checking if the course already available in database or not
                        our_courses = OurCourse.objects.all()

                        new_title = new_course_title.replace(
                            " ", "").capitalize()
                        for course in our_courses:

                            if new_title == str(course) and new_category == str(course.course_category).replace(" ", "").capitalize():
                                course_status = "exists"
                                break
                            else:
                                course_status = "new"

                        # Creating a new course in existing category
                        if course_status == "new":

                            try:

                                # Getting the pdf file from the form if one exists
                                new_course_pdf = request.FILES["newcoursepdf"]

                                # Storing the Course and details in the database with pdf file
                                OurCourse.objects.create(
                                    course_title=new_course_title,
                                    course_category=new_course_category,
                                    course_link=new_course_link,
                                    course_pdf=new_course_pdf
                                )

                            except MultiValueDictKeyError:

                                # Storing the Course and details in the database without pdf file
                                OurCourse.objects.create(
                                    course_title=new_course_title,
                                    course_category=new_course_category,
                                    course_link=new_course_link
                                )

                            finally:
                                successMessage = (
                                    "Course Added Successfully", 0)

                                return JsonResponse({"message": list(successMessage)})

                        elif course_status == "exists":

                            errorMessage = (
                                "Sorry! Course Already Available", 0)

                            return JsonResponse({"message": list(errorMessage)})

        # Confirming the POST method belongs to Update Course Form
        elif which_form == "Update":

            # Function for Updating Pdf file ----------------------------
            def pdfUpdater(courses, success, error):

                try:
                    # Getting the pdf file from the form if one exists
                    update_course_pdf = request.FILES["updatecoursepdf"]

                    for detail in courses:

                        if detail.course_pdf == "":

                            # Saving the New Pdf if the Existing Pdf is empty
                            detail.course_pdf = update_course_pdf
                            detail.save()

                        else:
                            # Deleting the old file
                            os.remove(detail.course_pdf.name)

                            # Updating the filtered course with New Pdf file
                            detail.course_pdf = update_course_pdf
                            detail.save()

                    successMessage = (success, 0)

                except MultiValueDictKeyError:

                    # Throws this error when the all field from edit section are empty
                    successMessage = (error, 0)

                return successMessage

            # ----------------------------

            # Getting the values of Update Course Form
            update_course_name = request.POST["updatecoursename"]
            update_course_title = request.POST["updatecoursetitle"]
            update_course_link = request.POST["updatecourselink"]
            # update_course_category = request.POST.get("updatecoursecategory")

            # Filtering the specific Course details with the name got from the Update form
            filtered_Course = OurCourse.objects.filter(
                course_title=update_course_name)

            if update_course_title == "" and update_course_link == "":

                # Calling the function for updating the pdf file
                message = pdfUpdater(
                    filtered_Course, "Course Material Updated Successfully", "Fields can't be empty")

                return JsonResponse({"message": list(message)})

            else:

                # Getting only the finally random string from the url
                link_values = str(update_course_link).split("/")

                # Checking the entered youtube url really exists or not
                webpage = requests.get("https://youtu.be/" +
                                       str(link_values[len(link_values)-1]))

                pattern = '"playabilityStatus":{"status":"ERROR","reason":"Video unavailable"'
                if pattern in webpage.text:

                    errorMessage = (
                        "Please, enter a valid Youtube Link", 0)

                    return JsonResponse({"message": list(errorMessage)})

                else:
                    # Changing the user entered link into a embeded link
                    link_values = str(update_course_link).split("/")
                    update_course_link = "https://www.youtube.com/embed/" + \
                        str(link_values[len(link_values)-1])

                    if update_course_title != "" and update_course_link != "":

                        # Updating the Course title and url with new ones
                        filtered_Course.update(
                            course_title=update_course_title,
                            course_link=update_course_link
                        )

                        # Calling the function for updating the pdf file
                        message = pdfUpdater(filtered_Course, "Title and Url Updated Successfully",
                                             "Course Updated Successfully")

                        return JsonResponse({"message": list(message)})

                    elif update_course_title != "" and update_course_link == "":

                        # Updating the Course title with new ones
                        filtered_Course.update(
                            course_title=update_course_title
                        )

                        # Calling the function for updating the pdf file
                        message = pdfUpdater(filtered_Course, "Course Title and Material Updated Successfully",
                                             "Course Title Updated Successfully")

                        return JsonResponse({"message": list(message)})

                    elif update_course_title == "" and update_course_link != "":

                        # Updating the Course title with new ones
                        filtered_Course.update(
                            course_link=update_course_link
                        )

                        # Calling the function for updating the pdf file
                        message = pdfUpdater(filtered_Course, "Course Url and Material Updated Successfully",
                                             "Course Url Updated Successfully")

                        return JsonResponse({"message": list(message)})

        # Confirming the POST method belongs to Delete Course Form
        elif which_form == "Delete":

            # Getting the values of Delete Course Form
            delete_course_category = request.POST.get("deletecoursecategory")
            delete_course_name = request.POST["deletecoursename"]

            # Getting the courses under the user selected Category
            category_filtered = OurCourse.objects.filter(
                course_category=delete_course_category)

            # Filtering the specific Course details under user selected Category with the name got from the Delete form
            course_filtered = category_filtered.filter(
                course_title=delete_course_name)

            # Creating a success message with deleted course name
            for name in course_filtered:

                # Returning the Status as success message
                successMessage = (
                    "'" + str(name.course_title) + "' deleted", 0)

                # Deleting the Selected Course's files
                if os.path.isfile(name.course_pdf.name):
                    os.remove(name.course_pdf.name)

            if len(category_filtered) == 1:

                # Getting the Category object with user selected category name
                category_selected = CourseCategory.objects.filter(
                    category_name=delete_course_category)

                # Deleting the Selected Category's files
                for detail in category_selected:

                    if os.path.isfile(detail.category_image.name):
                        os.remove(detail.category_image.name)

                # Returning the Status as success message
                for name in course_filtered:

                    successMessage = (
                        "'" + str(name.course_title) + "'&ensp;and&ensp;'" + str(name.course_category) + "'&ensp;deleted", 0)

                    # Deleting the Selected Category
                    category_selected.delete()

                # Deleting the Selected Course
                course_filtered.delete()

            return JsonResponse({"message": list(successMessage)})

        else:

            errorMessage = ("Sorry! this is ours, try again.", 0)
            return JsonResponse({"message": list(errorMessage)})

    # Calling the function for getting some random courses for Footer's Topics Section and also for HomePage
    footerTOpics()

    return render(request, "settings.html", {"footer_topics": footer_topics, "interfaces": interfaces, "categories_list": categories_list})


@login_required
def interfaceChanger(request):

    # Getting the value of confirmation form input
    which_form = request.POST["whichform"]

    global interfaces

    # Confirming the POST method belongs to Add Course Form
    if which_form == "Add":

        interfaces = {
            "addinterface": "preview",
            "updateinterface": "",
            "deleteinterface": ""
        }
        successMessage = ("Success", 0)

    # Confirming the POST method belongs to Update Course Form
    elif which_form == "Update":

        interfaces = {
            "addinterface": "",
            "updateinterface": "preview",
            "deleteinterface": ""
        }
        successMessage = ("Success", 0)

    # Confirming the POST method belongs to Delete Course Form
    elif which_form == "Delete":

        interfaces = {
            "addinterface": "",
            "updateinterface": "",
            "deleteinterface": "preview"
        }
        successMessage = ("Success", 0)

    return JsonResponse({"message": list(successMessage)})


# Function for collecting and sending back the Course Names
@login_required
def courseCollecter(request):

    if request.method == "POST":

        # Getting the value of confirmation form input
        which_form = request.POST["whichform"]

        if which_form == "Update":

            # Getting the category from Update Course Form
            update_category_name = request.POST["updatecoursecategory"]

            # Getting the courses from the database which matches to the category
            update_courses = OurCourse.objects.filter(
                course_category=update_category_name)

            update_course = []
            for course in update_courses:
                update_course.append(course.course_title)

            successMessage = ("Success", update_course)

            return JsonResponse({"message": list(successMessage)})

        elif which_form == "Delete":

            # Getting the category from Delete Course Form
            delete_category_name = request.POST["deletecoursecategory"]

            # Getting the courses from the database which matches to the category
            delete_courses = OurCourse.objects.filter(
                course_category=delete_category_name)

            delete_course = []
            for course in delete_courses:
                delete_course.append(course.course_title)

            successMessage = ("Success", delete_course)

            return JsonResponse({"message": list(successMessage)})

    return redirect("/admin-settings")


# Function for logging out from admin account
def logout(request):

    # Resetting the adminInterface
    resetingInterface()

    auth.logout(request)
    return redirect(previousUrl)


# Function for creating the random Footer Topics
def footerTOpics():

    # Getting all the course categories from the database -------------
    course_categories = CourseCategory.objects.all()

    global ourcourses
    ourcourses = []
    for course in course_categories:
        ourcourses.append(course)

    random.shuffle(ourcourses)

    # Sending the Course Categories for footer
    global footer_topics
    footer_topics = []

    if ourcourses:
        coursecount = 0
        while (coursecount <= 4):
            footer_topics.append(ourcourses[coursecount])
            coursecount += 1
    # -------------


# -------------------------------------------------------------------------------------
# Default value for urlpath
previousUrl = "/"
admin_name = ""
pass_word = ""

# Default values for activating Admin Inteface
interfaces = {
    "addinterface": "preview",
    "updateinterface": "",
    "deleteinterface": ""
}
