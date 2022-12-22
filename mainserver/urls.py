from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# local Django
from .settings.base import DEBUG

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("courseWebsite.urls")),
    path("administrator/", include("administrator.urls")),
    path("administrator/settings/", include("adminInterface.urls")),
]

if DEBUG:
    urlpatterns += static(prefix=settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
