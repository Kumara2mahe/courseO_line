# Django
from django.urls import path

# local Django
from . import views


urlpatterns = [
    path("", views.adminSettings, name="settings"),
    path("interface-changer", views.interfaceChanger, name="interface-changer"),
    path("add-course", views.addCourse, name="add-course"),
    path("collect-course", views.courseCollecter, name="collect-course"),
    path("update-course", views.updateCourse, name="update-course"),
    path("delete-course", views.deleteCourse, name="delete-course"),
]
