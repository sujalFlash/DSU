
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from .models import Medicines
from .serializers import MedicineSerializer


class Medicine_View(APIView):
    permission_classes = [IsAuthenticated]
    model = Medicines
    serializer_class = MedicineSerializer
    def get(self, request):
        medicines=Medicines.objects.filter(hospital=request.user.hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)



