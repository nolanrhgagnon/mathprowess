from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django_prometheus import exports

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("consultations.urls")),
    path("api/metrics", exports.ExportToDjangoView, name='prometheus-metrics'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
