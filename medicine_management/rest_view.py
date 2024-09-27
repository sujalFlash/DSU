
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListCreateAPIView, ListAPIView
from .models import Medicines
from .serializers import MedicineSerializer

from .serializers import MedicineCreateSerializer
class Medicine_View(APIView):
    permission_classes = [IsAuthenticated]
    model = Medicines
    serializer_class = MedicineSerializer
    http_allowed_methods = ['get']
    def get(self, request):
        medicines=Medicines.objects.filter(hospital=request.user.hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
class Medicine_Create(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MedicineCreateSerializer
    def perform_create(self,serializer):
        serializer.save(hospital=self.request.user.hospital)

class Medicine_List_View_from_other_hospitals(APIView):
    model=Medicines
    permission_classes = [IsAuthenticated]
    serializer_class = MedicineSerializer
    http_allowed_methods = ['get']
    def get(self,request):
        medicines=Medicines.objects.exclude(hospital = request.user.hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
