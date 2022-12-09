# Django
from django.contrib import admin

# local Django
from .models import VerificationOtp


# Registering App Models
admin.site.register(VerificationOtp)
