from django.contrib import admin
from courseWebsite.models import AppCredential, CourseCategory, OurCourse

# Register your models here.
admin.site.register(AppCredential)
admin.site.register(CourseCategory)
admin.site.register(OurCourse)
