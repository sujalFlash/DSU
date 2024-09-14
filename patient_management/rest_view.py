from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import DiseaseHistory, Hospital  # Import DiseaseHistory model
from .serializers import DiseaseHistorySerializer  # Create or import a serializer for DiseaseHistory
from .permissions import IsDoctorOrStaffOrManagerOrNurse


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
