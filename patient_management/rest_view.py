from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import DiseaseHistory,Patient
from .serializers import DiseaseHistorySerializer,DiseaseHistoryUpdateSerializer
from .permissions import IsDoctorOrStaffOrManagerOrNurse
from staff_management.permissions import IsDoctor

@api_view(['GET'])
@permission_classes([IsDoctorOrStaffOrManagerOrNurse])  # Optional: if you want to restrict this to logged-in users
def list_disease_history_for_hospital(request):
    """
    List disease history for patients of the hospital associated with the logged-in user.
    """
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
    """
    Allow doctors to update hospital, status, and severity of a disease history.
    """
    try:
        disease_history = DiseaseHistory.objects.get(pk=pk)
    except DiseaseHistory.DoesNotExist:
        return Response({"detail": "Disease history not found."}, status=status.HTTP_404_NOT_FOUND)
    if disease_history.hospital != request.user.hospital:
        return Response({"detail": "You do not have permission to update this disease history."},
                        status=status.HTTP_403_FORBIDDEN)

    # Use the partial update serializer to update fields
    serializer = DiseaseHistoryUpdateSerializer(disease_history, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()  # Save the updated fields
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)