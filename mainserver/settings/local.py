from .base import *


# Allowed Hosts
ALLOWED_HOSTS = []

if not DEBUG and not ALLOWED_HOSTS:
    print(
        f"!! Invalid Request: You can't use '{__name__}' module, as far as ALLOWED_HOSTS is empty")

elif not DEBUG:
    print(
        f"!! INFO: DEBUG Mode is set to {DEBUG}, so Django can't serve static files")


# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "db.sqlite3",
    }
}


# Email Configuration
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
