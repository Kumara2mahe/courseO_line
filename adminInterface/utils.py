# Third Party
import requests
from cloudinary import uploader

# local Django
from mainserver.settings import DEBUG, MEDIA_ROOT
from courseWebsite.models import CourseDetail

ERROR = '"playabilitystatus":{"status":"error","reason":"video unavailable"'


def isUTubeLink(link: str):
    """
        Check a string of link is valid youtube link and if link is a valid one,
        then generate a new embed link from the passed in link with domain as 'www.youtube-nocookie.com'

        Parameters:
            link (str): string of letters representing a path/url

        Return:
            None|str: link is valid returns embeded link with uid
    """
    uid = link.split("/")[-1]
    response = requests.get(f"https://youtu.be/{uid}")

    return None if ERROR in response.text.lower() else f"https://www.youtube-nocookie.com/embed/{uid}"


def fieldValidation(oldcourse, **updatefields):
    """
        Validate the Update Form Edit section fields,
        and also updating the new values to the passed in object instance.

        Parameters:
            oldcourse (CourseDetail): instance of the course to be replace
            updatefields (dict[str, object]): contains the values of fields to be replaced with

        Return:
            dict[str, object|str]: which has the key value pair of updated fields or the error message
    """

    # Collecting values of old and edit fields
    title = oldcourse.course_title
    category = oldcourse.course_category
    e_title = updatefields.get("e_title")
    e_link = updatefields.get("e_link")
    e_pdf = updatefields.get("e_pdf")
    updatedFields = {"name": []}

    if e_title is not None and e_title != "" and e_title != title:
        if CourseDetail.objects.filter(course_category=category, course_title=e_title).exists():
            return {"info": "duplicate",
                    "message": f"Title can't be updated, because it already available under '{category}'"}
        oldcourse.course_title = e_title
        updatedFields["name"].append("title")

    if e_link is not None and e_link != "":
        if (e_link := isUTubeLink(e_link)) is None:
            return {"info": "invalidlink",
                    "message": "Please, enter a valid Youtube Link"}
        oldcourse.course_link = e_link
        updatedFields["name"].append("link")

    if e_pdf is not None and e_pdf != "":
        if not e_pdf.name.endswith(".pdf"):
            return {"info": "notpdf",
                    "message": "Course materials should be in pdf format"}

        # Replacing old pdf with new
        removeInstance(oldcourse, onlyfile=True)
        oldcourse.course_pdf = e_pdf
        updatedFields["name"].append("pdf")

    return updatedFields


def removeInstance(object, onlyfile=False):
    """
        Remove Model instances along with media files

        Parameters:
            object (CourseCategory|CourseDetail): instance of custom Model
            [onlyfile] (bool): true means deletes the file and leave the instance
    """

    if type(object).__name__ == "CourseCategory":
        file = object.category_image.name
    else:
        file = object.course_pdf.name
    if file != "":
        if DEBUG:
            (MEDIA_ROOT / file).unlink(True)
        else:
            uploader.destroy(file)
    if not onlyfile:
        object.delete()
