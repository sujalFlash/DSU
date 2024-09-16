from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import DiseaseHistory,Patient
from .serializers import DiseaseHistorySerializer,DiseaseHistoryUpdateSerializer
from .permissions import IsDoctorOrStaffOrManagerOrNurse
from staff_management.permissions import IsDoctor
from .serializers import DiseaseSerializer
from rest_framework.permissions import IsAuthenticated
from staff_management.models import Doctor,NursingStaff,CleaningStaff,ReceptionStaff
@api_view(['GET'])
@permission_classes([IsDoctorOrStaffOrManagerOrNurse])  # Optional: if you want to restrict this to logged-in users
def list_disease_history_for_hospital(request):
    user = request.user  # Get the logged-in user
    if not hasattr(user, 'hospital'):  # Check if the user is associated with a hospital
        return Response({"detail": "User does not belong to any hospital."}, status=status.HTTP_400_BAD_REQUEST)

    hospital = user.hospital  # Assuming `hospital` is linked to the user
    disease_histories = DiseaseHistory.objects.filter(hospital=hospital)  # Filter disease history for that hospital
    serializer = DiseaseHistorySerializer(disease_histories, many=True)  # Serialize the data

    return Response(serializer.data, status=status.HTTP_200_OK)  # Return the serialized data
@api_view(['PATCH'])
@permission_classes([IsDoctor])  # Only doctors are allowed to update the disease history
def update_disease_history(request, pk):
    try:
        disease_history = DiseaseHistory.objects.get(pk=pk)
    except DiseaseHistory.DoesNotExist:
        return Response({"detail": "Disease history not found."}, status=status.HTTP_404_NOT_FOUND)
    if disease_history.hospital != request.user.hospital:
        return Response({"detail": "You do not have permission to update this disease history."},
                        status=status.HTTP_403_FORBIDDEN)
    serializer = DiseaseHistoryUpdateSerializer(disease_history, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()  # Save the updated fields
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import logging

logger = logging.getLogger(__name__)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_disease(request):
    user = request.user

    # Initialize variables
    is_doctor = False
    is_manager = False
    user_hospital = None
    print(user.username)
    print(user.password)
    print(hasattr(user,'staff_member'))
    if isinstance(user.staff_member,NursingStaff):
        print("User is nurse")
    else:
        print("User is not nurse")
    if isinstance(user.staff_member,CleaningStaff):
        print("User is cleaner")
    else:
        print("Useer is not cleaner")
    if isinstance(user.staff_member,ReceptionStaff):
        print("User is reception")
    else:
        print("User is not reception")
    doctor=Doctor()

    print(f"{type(user.staff_member)}")
    # Check if the user is a Doctor (staff_member) or WorkManager (manager)
    if hasattr(user, 'staff_member') and isinstance(user.staff_member, Doctor):
        # User is a doctor
        is_doctor = True
        user_hospital = user.staff_member.hospital  # Get the doctor's hospital
        print(f"User is a doctor. Hospital: {user_hospital}")
    else:
        print(f"User is not a doctor")


    if hasattr(user, 'manager'):
        # User is a manager
        is_manager = True
        user_hospital = user.manager.hospital  # Get the manager's hospital
        logger.debug(f"user is  a manager,hospital:{user_hospital}")
    else:
        logger.debug(f"user is not manager")
    print(is_doctor)
    print(is_manager)
    # Only allow if the user is a doctor or a manager
    if is_doctor or is_manager:
        data = request.data.copy()  # Make a mutable copy of the request data
        data['hospital'] = user_hospital.id  # Add hospital to the data

        serializer = DiseaseSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'detail': 'Only doctors or work managers can create diseases.'}, status=status.HTTP_403_FORBIDDEN)