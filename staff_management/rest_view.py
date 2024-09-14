from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from .models import Department, WorkManager,Hospital
from .serializers import DepartmentSerializer
from .permissions import IsHospitalManager,IsDoctor


@api_view(['POST'])
@permission_classes([IsHospitalManager])
def create_department_api(request):
    if request.method == 'POST':
        serializer = DepartmentSerializer(data=request.data, context={'request': request})

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
