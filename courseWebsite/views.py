
# Django
from django.shortcuts import render
from django.http import JsonResponse

# Local Django
from .models import CourseCategory, CourseDetail
from common.utils import collectCourse, showError, getlinks, sendMail
from .utils import placeholderPicker, footerTopics
from mainserver.settings.base import EMAIL_HOST_USER

APP_NAME = "courseWebsite"


def home(request):
    """ View for rendering Home-Page """

    # Random courses and categories
    top_courses = collectCourse(coursemodel=CourseDetail,
                                rand=True,
                                count=4)
    categories = collectCourse(coursemodel=CourseCategory,
                               rand=True,
                               hascourse=True,
                               count=8)

    # Pick a random placeholder image & footer topics
    placeholder_img = placeholderPicker()
    if not (footer_topics := categories[0:4]):
        return showError(request, 500)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, f"{APP_NAME}/home.html", {"placeholder_img": placeholder_img,
                                                     "top_courses": top_courses,
                                                     "categories": categories,
                                                     "has_footer": True,
                                                     "footer_topics": footer_topics})


def about(request):
    """ View for rendering About-Page """

    # Random course categories
    footer_topics = collectCourse(coursemodel=CourseCategory,
                                  rand=True,
                                  hascourse=True,
                                  count=4)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, f"{APP_NAME}/about.html", {"has_footer": True,
                                                      "footer_topics": footer_topics})


def courses(request):
    """ View for rendering Courses-Page """

    # All Categories and its courses
    categories = collectCourse(coursemodel=CourseCategory,
                               rand=False,
                               order_by="category_name",
                               hascourse=True)
    all_courses = []
    for cat in categories:
        all_courses.append(CourseDetail.objects.filter(
            course_category_id=cat.category_name))
    all_courses = zip(all_courses, categories)

    # Pick random placeholder image & footer topics
    placeholder_img = placeholderPicker()
    if not (footer_topics := footerTopics(categories)):
        return showError(request, 500)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, f"{APP_NAME}/courses.html", {"placeholder_img": placeholder_img,
                                                        "courses": all_courses,
                                                        "categories": categories,
                                                        "has_footer": True,
                                                        "footer_topics": footer_topics})


def contact(request):
    """ View for rendering Contact-Page """

    if request.method == "POST":
        name = request.POST["visitername"]
        email = request.POST["visiteremail"]
        subject = request.POST["querysubject"]
        query = request.POST["visiterquery"]

        if name == "" and email == "" and query == "":
            return JsonResponse({"info": "empty",
                                 "message": "Make sure the fields with asterisk(*) are not empty"})
        elif name == "":
            return JsonResponse({"info": "empty",
                                 "message": "Oops! without a name how can we call you"})
        elif email == "":
            return JsonResponse({"info": "empty",
                                 "message": "Sorry, you forgot to enter your email"})
        elif query == "":
            return JsonResponse({"info": "empty",
                                 "message": "Don't hesitate to give us feedback"})

        # Filling user feedback with content and Sending as mail
        sitelinks = getlinks(request, False)
        mailcontent = {
            "name": name,
            "email": email,
            "feedback": query,
            "subject": subject
        }
        response = sendMail(to=EMAIL_HOST_USER, as_="feedback",
                            **mailcontent, **sitelinks)
        return JsonResponse(response)

    # Random course categories
    footer_topics = collectCourse(coursemodel=CourseCategory,
                                  rand=True,
                                  hascourse=True,
                                  count=4)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, f"{APP_NAME}/contact.html", {"has_footer": True,
                                                        "footer_topics": footer_topics})
