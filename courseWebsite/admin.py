# Django
from django.contrib import admin

# local Django
from .models import CourseCategory, CourseDetail


# Registering App Models
admin.site.register(CourseCategory)
admin.site.register(CourseDetail)
