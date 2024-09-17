from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status,generics
from django.core.exceptions import PermissionDenied
from .models import Department, WorkManager, Hospital, NursingStaff,CustomUser
from .serializers import DepartmentSerializer, DoctorSerializer, DoctorCreateSerializer, ListDepartmentSerializer, \
    NursingStaffSerializer
from .permissions import IsHospitalManager,IsDoctor,IsManagerOrSuperuser
from .models import Doctor
from rest_framework.permissions import IsAuthenticated

from .serializers import CustomUserSerializer
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
@permission_classes([IsAuthenticated])
def view_doctors(request):
    auth_user = request.user
    if not auth_user.hospital:
        return Response({"error": "User does not belong to any hospital."}, status=status.HTTP_400_BAD_REQUEST)
    doctors = Doctor.objects.filter(hospital=auth_user.hospital)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_departments(request):
    try:
        hospital = request.user.hospital
        departments = Department.objects.filter(hospital=hospital)
        serializer = ListDepartmentSerializer(departments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except AttributeError:
        return Response({'detail': 'User does not have an associated hospital'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['DELETE'])
@permission_classes([IsHospitalManager])
def delete_doctor(request,pk):
    try:
        doctor=Doctor.objects.get(id=pk)
        doctor.delete()
        return Response({'detail':'Doc was successfull deleted'},status=status.HTTP_200_OK)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doc does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_nurses(request):
    if not request.user.hospital:
        return Response({"detail":'User does not belong to Hospital'},status=status.HTTP_400_BAD_REQUEST)

    nurse=NursingStaff.objects.filter(hospital=request.user.hospital)
    serializer=NursingStaffSerializer(nurse,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
class CustomUserCreativeView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated,IsHospitalManager]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})  # Pass request to serializer
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,headers=headers)


'''@api_view(['POST'])
@permission_classes([IsAuthenticated,IsHospitalManager])
def add_nurses(request):

    if not request.user.hospital:
        return Response({"detail":"User doesnot belong to Hospital"},status=status.HTTP_400_BAD_REQUEST)
    serializer=NurseCreateSerializer(data=request.data,context={'hospital':request.user.hospital,'request':request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


'''