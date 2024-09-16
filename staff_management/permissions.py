from operator import truediv

from rest_framework.permissions import BasePermission
from sympy import false
from staff_management.models import Doctor
from .models import WorkManager
from rest_framework.permissions import BasePermission
class IsHospitalManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Allow superusers to access any hospital's data
        if request.user.is_superuser:
            return True

        # Get all WorkManager instances related to the user
        workmanagers = request.user.manager.all()

        # Ensure there is at least one WorkManager instance
        if not workmanagers.exists():
            return False

        # Ensure the object has a hospital attribute
        if not hasattr(obj, 'hospital'):
            return False

        # Check if any WorkManager instance is associated with the same hospital and has the role 'manager'
        has_permission = any(
            wm.hospital == obj.hospital and wm.role == 'manager'
            for wm in workmanagers
        )

        return has_permission

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        is_doctor=False
        doctor=Doctor.objects.filter(hospital=request.user.hospital)
        for each_doctor in doctor:
            if each_doctor.user==request.user:
                is_doctor=True
                break
        return request.user.is_authenticated and is_doctor
class IsManagerOrSuperuser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_superuser or hasattr(request.user, 'manager'))