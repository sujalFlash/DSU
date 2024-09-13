from rest_framework import permissions
from .models import Doctor, StaffMember, WorkManager


class HospitalPermission(permissions.BasePermission):
    """
    Custom permission to check if the object belongs to the user's hospital.
    Handles different types of objects like Doctor, StaffMember, WorkManager, and WorkAssignment.
    """

    def has_object_permission(self, request, view, obj):
        # Ensure that the user has a related profile
        user = request.user

        # Check if the user is a Doctor
        if hasattr(user, 'doctor_profile'):
            user_hospital = user.doctor_profile.hospital
        # Check if the user is a StaffMember
        elif hasattr(user, 'staff_member'):
            user_hospital = user.staff_member.hospital
        # Check if the user is a WorkManager
        elif hasattr(user, 'manager'):
            user_hospital = user.manager.hospital
        else:
            return False

        # For Doctor, check if the hospital of the doctor matches the user's hospital
        if isinstance(obj, Doctor):
            return obj.hospital == user_hospital

        # For StaffMember, check if the hospital of the staff member matches the user's hospital
        elif isinstance(obj, StaffMember):
            return obj.hospital == user_hospital

        # For WorkManager, check if the hospital of the work manager matches the user's hospital
        elif isinstance(obj, WorkManager):
            return obj.hospital == user_hospital

        return False
class IsSuperiorOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow view-only access for all authenticated users
        if view.action in ['retrieve', 'list']:
            return True

        # Allow create or delete only for superiors or managers
        if view.action in ['create', 'destroy']:
            return request.user.staff_member.role in ['superior', 'manager']

        return False
