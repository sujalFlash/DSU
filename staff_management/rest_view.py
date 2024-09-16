from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from .models import Department, WorkManager,Hospital
from .serializers import DepartmentSerializer, DoctorSerializer, DoctorCreateSerializer
from .permissions import IsHospitalManager,IsDoctor,IsManagerOrSuperuser
from .models import Doctor
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
@permission_classes([IsHospitalManager])
def create_department_api(request):
    if request.method == 'POST':
        print("Department creation is authenticated for your own hospital")
        serializer = DepartmentSerializer(data=request.data, context={'request': request})
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()  # Hospital is set within the serializer
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_departments_by_hospital_api(request):
    """
    List all departments grouped by their associated hospitals.
    """
    if request.method != 'GET':
        return Response({"detail": "Method not allowed."}, status=status.HTTP_400_BAD_REQUEST)

    hospitals = Hospital.objects.all()  # Get all hospitals
    data = []

    for hospital in hospitals:
        departments = Department.objects.filter(hospital=hospital)  # Get departments for each hospital
        serializer = DepartmentSerializer(departments, many=True)  # Serialize the list of departments
        data.append({
            'hospital': hospital.name,  # Assuming hospital model has a 'name' field
            'departments': serializer.data  # Attach the serialized departments
        })
    return Response(data, status=status.HTTP_200_OK)  # Return the structured data with a 200 OK status


@api_view(['POST'])
@permission_classes([IsManagerOrSuperuser])
def create_doctor(request):
    user = request.user

    if hasattr(user, 'manager'):
        hospital = user.manager.hospital  # Get the hospital associated with the manager
    else:
        return Response({"detail": "User is not associated with any hospital."}, status=status.HTTP_400_BAD_REQUEST)

    # Pass hospital in the serializer context
    serializer = DoctorCreateSerializer(data=request.data, context={'hospital': hospital,'request':request})

    if serializer.is_valid():
        serializer.save()  # Now hospital is available in the serializer context
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def view_doctors(request):
    # Get the authenticated user
    auth_user = request.user

    # Ensure the user has a hospital assigned
    if not auth_user.hospital:
        return Response({"error": "User does not belong to any hospital."}, status=status.HTTP_400_BAD_REQUEST)

    # Query doctors associated with the user's hospital
    doctors = Doctor.objects.filter(hospital=auth_user.hospital)

    # Serialize the doctor data
    serializer = DoctorSerializer(doctors, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)