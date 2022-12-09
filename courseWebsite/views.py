
# Django
from django.shortcuts import render
from django.http import JsonResponse

# Local Django
from .models import CourseCategory, CourseDetail
from common.utils import collectCourse, footerTopics, getlinks, sendMail
from .utils import placeholderPicker
from mainserver.settings import EMAIL_HOST_USER


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

    # Pick a random placeholder image
    placeholder_img = placeholderPicker()

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, "home.html", {"placeholder_img": placeholder_img,
                                         "top_courses": top_courses,
                                         "categories": categories,
                                         "footer_topics": categories[0:4]})


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

    return render(request, "about.html", {"footer_topics": footer_topics})


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
    footer_topics = footerTopics(categories)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, "courses.html", {"placeholder_img": placeholder_img,
                                            "courses": all_courses,
                                            "categories": categories,
                                            "footer_topics": footer_topics})


def contact(request):
    """ View for rendering Contact-Page """

    # Random course categories
    footer_topics = collectCourse(coursemodel=CourseCategory,
                                  rand=True,
                                  hascourse=True,
                                  count=4)

    # Storing current url in session
    request.session["previousurl"] = {"user": request.path,
                                      "auth": None}

    return render(request, "contact.html", {"footer_topics": footer_topics})
