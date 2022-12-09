# Django
from django.urls import path

# local Django
from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("about", views.about, name="about"),
    path("courses", views.courses, name="courses"),
    path("contact", views.contact, name="contact"),
]
