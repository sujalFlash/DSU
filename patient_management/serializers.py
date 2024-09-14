from rest_framework import serializers
from .models import DiseaseHistory

class DiseaseHistorySerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = DiseaseHistory
        fields = ['id', 'patient_name', 'disease_name', 'hospital_name', 'date_diagnosed', 'status', 'severity']
