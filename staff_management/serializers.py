# staff/serializers.py
from rest_framework import serializers
from .models import  Department,Doctor, StaffMember, NursingStaff, ReceptionStaff, CleaningStaff, WorkManager, WorkAssignment
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'hospital']
        read_only_fields = ['hospital']  # Make hospital read-only to prevent modification from client side

    def create(self, validated_data):
        # Extract the hospital from the request context
        request = self.context.get('request')
        if request and request.user and hasattr(request.user, 'manager'):
            work_manager = request.user.manager.first()
            hospital = work_manager.hospital
        else:
            # Default or handle if there's no valid work manager, though it should always be present
            raise serializers.ValidationError("WorkManager instance not found or user is not authenticated.")

        # Create the department with the hospital field set
        return Department.objects.create(hospital=hospital, **validated_data)

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


class DoctorCreateSerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )

    class Meta:
        model = Doctor
        fields = ['employee_id', 'name', 'specialization', 'departments']

    def validate_employee_id(self, value):
        if Doctor.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("An employee with this ID already exists.")
        return value

    def create(self, validated_data):
        departments = validated_data.pop('departments')
        # Use .get() to avoid KeyError and handle the case where 'hospital' is not present
        hospital = self.context.get('hospital')
        if not hospital:
            raise serializers.ValidationError("Hospital is required to create a doctor.")

        doctor = Doctor.objects.create(hospital=hospital, **validated_data)
        doctor.departments.set(departments)
        return doctor