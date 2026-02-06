from rest_framework.serializers import ModelSerializer

from .models import Consultation, Prospect


class ProspectSerializer(ModelSerializer):
    class Meta:
        model = Prospect
        fields = "__all__"


class ConsultationSerializer(ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"
