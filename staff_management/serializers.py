# staff/serializers.py
from rest_framework import serializers
from .models import  Department,Doctor, StaffMember, NursingStaff, ReceptionStaff, CleaningStaff, WorkManager, WorkAssignment,CustomUser
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'hospital']
        read_only_fields = ['hospital']  # Make hospital read-only to prevent modification from client side

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and hasattr(request.user, 'manager'):
            work_manager = request.user.manager
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
        fields = ['id','employee_id', 'name', 'specialization', 'departments', 'hospital', 'status', 'shift']
class StaffMemberSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = StaffMember
        fields = ['user_id','id','employee_id', 'name', 'role', 'departments', 'hospital', 'status', 'shift']

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
    print("sujal")
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Doctor
        fields = ['user_id', 'employee_id', 'name', 'specialization', 'departments']

    def validate_employee_id(self, value):
        if Doctor.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("An employee with this ID already exists.")
        return value

    def validate_user_id(self, value):
        try:
            user = CustomUser.objects.get(id=value)
            auth_user = self.context['request'].user
            if user.hospital != auth_user.hospital:
                raise serializers.ValidationError("The specified user must belong to the same hospital as the authenticated user.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("The specified user does not exist.")
        return value

    def validate_departments(self, value):
        # Get the authenticated user
        auth_user = self.context['request'].user
        hospital = auth_user.hospital

        # Check each department to ensure it belongs to the same hospital
        for department in value:
            if department.hospital != hospital:
                raise serializers.ValidationError(f"Department {department.id} does not belong to your hospital.")

        return value
    def create(self, validated_data):
        departments = validated_data.pop('departments')
        auth_user = self.context['request'].user
        hospital = auth_user.hospital
        if not hospital:
            raise serializers.ValidationError("Hospital is required to create a doctor.")
        doctor = Doctor.objects.create(hospital=hospital, **validated_data)
        doctor.departments.set(departments)
        return doctor
class ListDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'hospital']
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id','username','password']
        extra_kwargs={'password':{'write_only':True}}
    def create(self,validated_data):
        request=self.context.get('request')
        hospital=request.user.hospital
        password=validated_data.pop('password')
        user=CustomUser.objects.create(hospital=hospital,**validated_data)
        user.set_password(password)
        user.save()
        return user