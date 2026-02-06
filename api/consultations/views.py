import json

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from .models import Consultation, Prospect
from .serializers import ConsultationSerializer, ProspectSerializer


class ConsultationList(ListAPIView):
    serializer_class = ConsultationSerializer
    queryset = Consultation.objects.all()


class ProspectList(ListAPIView):
    serializer_class = ProspectSerializer
    queryset = Prospect.objects.all()


class ConsultationRetrieve(RetrieveAPIView):
    lookup_field = "slug"
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class ProspectRetrieve(RetrieveAPIView):
    lookup_field = "email"
    queryset = Prospect.objects.all()
    serializer_class = ProspectSerializer


@csrf_exempt
@api_view(["POST"])
def create_consultation(request):
    payload = request.body.decode("utf-8")
    consultation_data = json.loads(payload)
    first_name = consultation_data["first"]
    last_name = consultation_data["last"]
    email = consultation_data["email"]
    message = consultation_data["message"]
    slug = consultation_data["slug"]
    prospect = Prospect.objects.create(
        first_name=first_name, last_name=last_name, email=email
    )
    consultation = Consultation.objects.create(
        prospect=prospect, message=message, slug=slug
    )

    return Response({"test": "test"})
