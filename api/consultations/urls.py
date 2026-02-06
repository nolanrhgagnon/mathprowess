from django.urls import path

from . import views

urlpatterns = [
    path(
        "api/consultations",
        views.ConsultationList.as_view(),
        name="consultations",
    ),
    path(
        "api/prospects",
        views.ProspectList.as_view(),
        name="prospects",
    ),
    path(
        "api/consultations/<slug:slug>",
        views.ConsultationRetrieve.as_view(),
        name="consultation_retrieve",
    ),
    path(
        "api/prospects/<str:email>",
        views.ProspectRetrieve.as_view(),
        name="prospect_retrieve",
    ),
    path(
        "api/consultations/create/",
        views.create_consultation,
        name="consultation_create",
    ),
]
