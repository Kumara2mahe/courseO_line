# Django
from django.urls import path

# local Django
from . import views


urlpatterns = [
    path("", views.redirectOrClose),
    path("close", views.redirectOrClose, name="close"),
    path("login", views.login, name="login"),
    path("signup", views.signup, name="signup"),
    path("reset-password", views.resetPassword, name="reset-password"),
    path("reset-password/sendotp", views.sendOtp, name="send-otp"),
    path("reset-password/checkotp", views.checkOtp, name="check-otp"),
    path("reset-password/update", views.updatePassword, name="update"),
    path("logout", views.logout, name="logout"),
]
