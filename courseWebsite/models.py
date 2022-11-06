from django.db import models
from django.core.validators import FileExtensionValidator


# Class for storing only the course category
class CourseCategory(models.Model):

    category_name = models.CharField(max_length=50)
    category_image = models.FileField(upload_to="Static/Uploads/Thumbnail", validators=[
                                      FileExtensionValidator(["png", "jpg", "jpeg"])])

    def __str__(self):

        category = ((self.category_name).replace(" ", "")).capitalize()
        return category


# Class for storing the course and it details
class OurCourse(models.Model):

    course_title = models.CharField(max_length=100)
    course_category = models.CharField(max_length=50)
    course_link = models.CharField(max_length=10000, null=False, blank=True)
    course_pdf = models.FileField(upload_to="Static/Uploads/Pdfs",
                                  null=False, blank=True, validators=[FileExtensionValidator(["pdf"])])

    def __str__(self):

        title = ((self.course_title).replace(" ", "")).capitalize()
        return title


# Class which contains courseOline's emailId and Password for sending OTP as emails
class AppCredential(models.Model):

    app_email = models.EmailField(max_length=100)
    app_password = models.CharField(max_length=50, editable=False)
