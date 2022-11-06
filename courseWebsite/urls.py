from django.urls import path
from courseWebsite import views


urlpatterns = [
    path("", views.home, name="home"),
    path("about", views.about, name="about"),
    path("courses", views.courses, name="courses"),
    path("contact", views.contact, name="contact"),
    path("admin-login", views.login, name="admin-login"),
    path("admin-login/close-admin-login",
         views.closeAdminLogin, name="close-admin-login"),
    path("admin-login/check-email-otp", views.checkEmail, name="check-email-otp"),
    path("admin-login/update-password",
         views.passwordUpdater, name="update-password"),
    path("admin-logout", views.logout, name="admin-logout"),
    path("admin-settings", views.adminSettings, name="admin-settings"),
    path("admin-settings/interface-changer",
         views.interfaceChanger, name="interface-changer"),
    path("admin-settings/update-courses",
         views.courseCollecter, name="update-courses"),
    path("admin-signup", views.signup, name="admin-signup")
]
