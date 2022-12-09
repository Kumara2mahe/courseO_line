
# Standard Library
import random
import re

# Django
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives, BadHeaderError

# local Django
from mainserver.settings import DEFAULT_FROM_EMAIL
from courseWebsite.models import CourseDetail

PRE_URL = "previousurl"


def collectCourse(coursemodel, rand: bool, order_by="id", hascourse=False, count: int | None = None):
    """
        Collect all or particular objects of courseWebsite's custom Models

        Parameters:
            coursemodel (CourseDetail | CourseCategory): model to search for
            rand (bool): decides to return the list as in natural order or shuffled
            [order_by] (str): field name to order the objects of passed in model
            [hascourse] (bool): only for CourseCategory model to check has any child objects in CourseDetail model
            [count] (int | None): takes a number of items to be returned in list

        Return:
            list[CourseDetail | CourseCategory]  a list of collected coursedetails/categories
    """
    all_courses = coursemodel.objects.all().order_by(order_by)
    if hascourse:
        all_courses = [c for c in all_courses if CourseDetail.objects.filter(
            course_category=c).count()]

    if rand:
        all_courses = list(all_courses)
        random.shuffle(all_courses)
        return all_courses[0:count]
    return all_courses


def footerTopics(topics):
    """
        Collect four random topics for Footer section from the passed in topics list

        Parameters:
            topics (list[CourseCategory]): a sequence of all topics

        Return:
            list[CourseCategory] - list of shuffled items of length 4
    """
    if type(topics).__name__ != "list":
        topics = list(topics)
    topics = topics.copy()
    random.shuffle(topics)
    return topics[0:4]


def showError(uRequest, status: int):
    """
        Render the error template with a status code

            Parameters:
                uRequest (HttpRequest)
                status (int): gets status code for the response 

            Return:
                a HttpResponse of Error template with its respective status code
    """

    response = render(uRequest, "error.html", {"statuscode": status})
    response.status_code = status
    return response


def getPreviousUrl(request, admin=True, default=None):
    """ 
        Get the previous url stored in the session object

            Parameters:
                uRequest (HttpRequest)
                [admin] (bool): True means check under the 'auth' key in session object
                [default] (str|None): path to the redirect url

            Return
                None|str: path to previous url or path in parameter(default)
    """
    url = {PRE_URL: request.session[key]
           for key in request.session.keys() if key == PRE_URL}
    if url:
        if admin and (preurl := url[PRE_URL]["auth"]) is not None:
            return preurl
        else:
            return url[PRE_URL]["user"]
    return default


def getlinks(request, admin: bool):
    """
        Get the site's full path with some additional links for admins

        Parameters:
            request: (HttpRequest)
            admin (bool): decides to add links related to admins

        Return:
            dict[str, str]: key value pair of urls of current site
    """

    absolute_path = request.build_absolute_uri()
    sitelink = absolute_path.split(request.path)[0]
    links = {"sitelink": sitelink}
    if admin:
        links.update({"resetlink": f"{sitelink}/administrator/reset-password",
                      "loginlink": f"{sitelink}/administrator/login"})
    else:
        links.update({"domain": sitelink.split("://")[1]})

    return links


def render_to_plain(html):
    """
        Convert HTML version to plain TEXT version,
        for users who can't view mails in HTML version

        Parameters:
            html (str): string version of html template

        Return:
            str: plain string of text
    """

    # Remove all html tags and continuous whitespaces
    plainText = re.sub("[ \t]+", " ", strip_tags(html))

    # Strip single spaces in the beginning of each line
    return plainText.replace("\n ", "\n").strip()


def sendMail(to, as_, **content):
    """
        Send passed in data as a mail by rendering it with the mail template to generate the concurrent mail,
        according to certain circumstances like sending mail for account creation and otp verification.

        Parameters:
            to (str): email id which the mail is to be sent
            as_ (str): get the purpose of mail as string
            [content|kwargs] (dict): contains the data which is to be rendered with mail template

        Return:
            dict[str, str]: which contains the status as a short info and as user understandable detailed message
    """

    # Html template to plain string of HTML version
    plainHTML = render_to_string("mail.html", content)

    # HTML version to a plain Text version
    plainTEXT = render_to_plain(plainHTML)

    try:
        if as_ == "password":
            msubject = "Admin Account have been created"
            msg = f"Admin created and Password sent to '{to}'"
        else:
            msubject = "Your 6-digit Verification Code"
            msg = f"OTP {content['msg']} successfully to '{to}'"

        # Sending E-mail
        mail = EmailMultiAlternatives(subject=msubject,
                                      body=plainTEXT,
                                      from_email=f"courseO_line {DEFAULT_FROM_EMAIL}",
                                      to=[to],
                                      alternatives=[
                                          (plainHTML, "text/html")
                                      ])
        mail.send()

        statusMessage = {"info": "sent",
                         "message": msg}

    except BadHeaderError:
        statusMessage = {"info": "failed",
                         "message": "Invalid Header Found!"}

    return statusMessage
