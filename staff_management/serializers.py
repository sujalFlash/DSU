# staff/serializers.py
from rest_framework import serializers
from .models import  Department,Doctor, StaffMember, NursingStaff, ReceptionStaff, CleaningStaff, WorkManager, WorkAssignment

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

class DoctorSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['employee_id', 'name', 'specialization', 'departments', 'hospital', 'status', 'shift']

class StaffMemberSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = StaffMember
        fields = ['employee_id', 'name', 'role', 'departments', 'hospital', 'status', 'shift']

class NursingStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = NursingStaff
        fields = StaffMemberSerializer.Meta.fields + ['qualifications']

class ReceptionStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = ReceptionStaff
        fields = StaffMemberSerializer.Meta.fields + ['desk_assigned']

class CleaningStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = CleaningStaff
        fields = StaffMemberSerializer.Meta.fields + ['area_assigned']
'''
class WorkManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkManager
        fields = ['id', 'name', 'contact_number', 'staff_members']

class WorkAssignmentSerializer(serializers.ModelSerializer):
    staff_member = StaffMemberSerializer()
    work_manager = WorkManagerSerializer()

    class Meta:
        model = WorkAssignment
        fields = ['id', 'staff_member', 'work_manager', 'work_name', 'assigned_date', 'end_date']
'''