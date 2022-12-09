from django.db import models
from django.core.validators import FileExtensionValidator


# Class to store all Course Category
class CourseCategory(models.Model):
    category_name = models.CharField(max_length=50, unique=True)
    category_image = models.FileField(upload_to="Thumbnails",
                                      validators=[FileExtensionValidator(
                                          ["png", "jpg", "jpeg"]
                                      )])

    def __str__(self):
        return self.category_name.replace(" ", "").capitalize()


# Class to Course specific details
class CourseDetail(models.Model):
    course_title = models.CharField(max_length=150)
    course_category = models.ForeignKey(to=CourseCategory,
                                        on_delete=models.CASCADE,
                                        to_field="category_name")
    course_link = models.CharField(max_length=10000, blank=True)
    course_pdf = models.FileField(upload_to="Pdfs", blank=True,
                                  validators=[FileExtensionValidator(["pdf"])])

    def __str__(self):
        return self.course_title.replace(" ", "").capitalize()
