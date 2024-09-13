from rest_framework import generics
from .models import Doctor, NursingStaff, ReceptionStaff, CleaningStaff
from .serializers import DoctorSerializer, NursingStaffSerializer, ReceptionStaffSerializer, CleaningStaffSerializer
from .permissions import HospitalPermission, IsSuperiorOrManager

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]  # Add role-based permission

    def get_queryset(self):
        # Filter doctors by the hospital of the requesting user
        return Doctor.objects.filter(hospital=self.request.user.doctor_profile.hospital if hasattr(self.request.user, 'doctor_profile') else self.request.user.staff_member.hospital)

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]  # Add role-based permission

    def get_object(self):
        # Ensure that the object belongs to the hospital of the requesting user
        return Doctor.objects.get(pk=self.kwargs['pk'], hospital=self.request.user.doctor_profile.hospital if hasattr(self.request.user, 'doctor_profile') else self.request.user.staff_member.hospital)

# Apply similar changes to views for NursingStaff, ReceptionStaff, and CleaningStaff
