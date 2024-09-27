from django.db import models

from hospital_management.models import Hospital
from patient_management.models import Patient


# Create your models here.
class Medicines(models.Model):
    brand_name = models.CharField(max_length=50)
    chemical_name = models.CharField(max_length=100)
    manufacturer_company_name = models.CharField(max_length=100)
    manufacturing_date = models.DateField()
    expiry_date = models.DateField()
    patient = models.ManyToManyField(Patient)
    bill=models.IntegerField(default=0)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE,default=1)
    def __str__(self):
        return f"{self.manufacturer_company_name} {self.manufacturer_company_name}"