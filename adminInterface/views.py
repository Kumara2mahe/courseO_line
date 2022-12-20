
# Django
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse

# Local Django
from courseWebsite.models import CourseCategory, CourseDetail
from common.utils import collectCourse, getPreviousUrl
from .utils import isUTubeLink, fieldValidation, removeInstance

OPERATIONS = ["add", "update", "delete"]
PREKEY = "previousurl"
IKEY = "interface"


@login_required(login_url="/administrator/login")
def adminSettings(request):
    """ View for rendering Settings-Page """

    # Random course categories
    footer_topics = collectCourse(coursemodel=CourseCategory,
                                  rand=True,
                                  hascourse=True,
                                  count=4)

    # Storing current url in session
    request.session[PREKEY] = {"user": getPreviousUrl(request, False),
                               "auth": request.path}

    # Storing default interface name
    if IKEY not in request.session.keys():
        request.session[IKEY] = "addcourse"

    return render(request, "adminInterface/settings.html", {"has_footer": True,
                                                            "footer_topics": footer_topics,
                                                            IKEY: request.session[IKEY]})


@require_POST
def interfaceChanger(request):
    """ View to update the current interface name with the one in session object """

    if (interface_name := request.POST[IKEY]) in OPERATIONS:

        # Updating the Interface name
        request.session[IKEY] = f"{interface_name}course"
        return JsonResponse({"message": "Success"})
    else:
        return JsonResponse({"message": "error"})


@require_POST
def addCourse(request):
    """ View to Add new course """

    c_title = request.POST["coursetitle"].strip().title()
    c_category = request.POST["coursecategory"].strip().title()
    c_link = request.POST["courselink"].strip()
    c_pdf = request.FILES.get("uploadedpdf")

    if c_title == "" or c_category == "" or c_link == "":
        return JsonResponse({"info": "empty",
                             "message": "Field with asterisk(*) can't be empty"})

    # Checking the new course already exists
    category = CourseCategory.objects.filter(category_name=c_category).first()
    course = CourseDetail.objects.filter(course_title=c_title,
                                         course_category=c_category).first()
    if category and course:
        return JsonResponse({"info": "exists",
                             "message": "Sorry! Course Already Available"})

    elif category is None:
        if not (category_image := request.FILES.get("categoryimage")):
            return JsonResponse({"info": "noimage",
                                 "message": "Image need to be added, when adding course in new category"})

        # Adding new Category
        category = CourseCategory.objects.create(category_name=c_category,
                                                 category_image=category_image)

    # Validating link and pdf
    if (c_link := isUTubeLink(c_link)) is None:
        return JsonResponse({"info": "invalidlink",
                             "message": "Please, enter a valid Youtube Link"})

    elif c_pdf and not c_pdf.name.endswith(".pdf"):
        return JsonResponse({"info": "notpdf",
                             "message": "Course materials should be in pdf format"})

    # Adding new Course
    new_course = {
        "course_title": c_title,
        "course_category": category,
        "course_link": c_link,
        "course_pdf": c_pdf
    }
    CourseDetail.objects.create(**new_course)

    return JsonResponse({"info": "added",
                         "message": "Course Added Successfully"})


@require_POST
def courseCollecter(request):
    """ View to collect all categories / courses lies under one category """

    if category := request.POST.get("category"):
        names = [str(c.course_title)
                 for c in CourseDetail.objects.filter(course_category=category)]
    else:
        names = [str(c.category_name) for c in collectCourse(coursemodel=CourseCategory, rand=False,
                                                             order_by="category_name", hascourse=True)]
    return JsonResponse({"category": category,
                         "titles": list(names)})


@require_POST
def updateCourse(request):
    """ View to Update existing course """

    c_name = request.POST["coursename"].strip().title()
    c_category = request.POST["coursecategory"].strip().title()
    e_title = request.POST["coursetitle"].strip().title()
    e_link = request.POST["courselink"].strip()
    e_pdf = request.FILES.get("uploadedpdf")

    if e_title == "" and e_link == "" and e_pdf is None:
        return JsonResponse({"info": "empty",
                             "message": "Atleast fill one of the Field in Edit section to update"})

    elif (existingCourse := CourseDetail.objects.filter(course_category=c_category, course_title=c_name).first()) is None:
        return JsonResponse({"info": "nomatch",
                             "message": "Course choosen doesn't exists, Try again with the right choice"})

    # Validating and updating the values
    valid = fieldValidation(existingCourse, **{"e_title": e_title,
                                               "e_link": e_link,
                                               "e_pdf": e_pdf})
    if valid.get("info"):
        return JsonResponse(valid)

    # Saving the edits made on Course
    existingCourse.save()

    # Generating success message
    updatedfields = valid["name"]
    updatedfields = "".join(f"{k}, " for k in updatedfields)
    msg = f"Course {updatedfields}Updated Successfully"

    return JsonResponse({"info": "updated",
                         "message": msg})


@require_POST
def deleteCourse(request):
    """ View to Delete existing course and also entire Category if empty """

    c_name = request.POST["coursename"].strip().title()
    c_category = request.POST["coursecategory"].strip().title()
    msg = f"Deleted Course: '{c_name}'"

    if (existingCourse := CourseDetail.objects.filter(course_category=c_category, course_title=c_name).first()) is None:
        return JsonResponse({"info": "nomatch",
                             "message": "Course choosen to delete doesn't exists, something went wrong try again."})

    # Deleting Course
    removeInstance(existingCourse)

    # Deleting Category if has no course
    if not CourseDetail.objects.filter(course_category=existingCourse.course_category).count():
        removeInstance(existingCourse.course_category)
        msg += f" along with its Category: '{existingCourse.course_category}'"

    return JsonResponse({"info": "deleted", "message": msg})
