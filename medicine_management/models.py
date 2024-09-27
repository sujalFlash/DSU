from django.db import models
from patient_management.models import Patient


# Create your models here.
class Medicines(models.Model):
    brand_name = models.CharField(max_length=50)
    chemical_name = models.CharField(max_length=100)
    manufacturer_company_name = models.CharField(max_length=100)
    manufacturing_date = models.DateField()
    expiry_date = models.DateField()
    patient = models.ManyToManyField(Patient)
