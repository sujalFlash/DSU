from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from .models import Medicines

class Medicine_View(APIView):
    permission_classes = [IsAuthenticated]
    model = Medicines
    def get(self, request):
        medicines=Medicines.objects.filter(hospital=request.user)
        return Response(medicines)



