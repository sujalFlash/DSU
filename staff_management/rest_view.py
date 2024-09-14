from rest_framework import generics
from .models import Doctor, NursingStaff, ReceptionStaff, CleaningStaff
from .serializers import DoctorSerializer, NursingStaffSerializer, ReceptionStaffSerializer, CleaningStaffSerializer
from .permissions import HospitalPermission, IsSuperiorOrManager

# Doctor Views
class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]

    def get_queryset(self):
        # Filter doctors based on the user's hospital
        user = self.request.user
        hospital = user.doctor_profile.hospital if hasattr(user, 'doctor_profile') else user.staff_member.hospital
        return Doctor.objects.filter(hospital=hospital)


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [HospitalPermission]

    def get_object(self):
        # Ensure that the object belongs to the hospital of the requesting user
        user = self.request.user
        hospital = user.doctor_profile.hospital if hasattr(user, 'doctor_profile') else user.staff_member.hospital
        return Doctor.objects.get(pk=self.kwargs['pk'], hospital=hospital)


# NursingStaff Views
class NursingStaffListCreateView(generics.ListCreateAPIView):
    queryset = NursingStaff.objects.all()
    serializer_class = NursingStaffSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]

    def get_queryset(self):
        # Filter nursing staff based on the user's hospital
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return NursingStaff.objects.filter(hospital=hospital)


class NursingStaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NursingStaff.objects.all()
    serializer_class = NursingStaffSerializer
    permission_classes = [HospitalPermission]

    def get_object(self):
        # Ensure that the object belongs to the hospital of the requesting user
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return NursingStaff.objects.get(pk=self.kwargs['pk'], hospital=hospital)


# ReceptionStaff Views
class ReceptionStaffListCreateView(generics.ListCreateAPIView):
    queryset = ReceptionStaff.objects.all()
    serializer_class = ReceptionStaffSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]

    def get_queryset(self):
        # Filter reception staff based on the user's hospital
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return ReceptionStaff.objects.filter(hospital=hospital)


class ReceptionStaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReceptionStaff.objects.all()
    serializer_class = ReceptionStaffSerializer
    permission_classes = [HospitalPermission]

    def get_object(self):
        # Ensure that the object belongs to the hospital of the requesting user
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return ReceptionStaff.objects.get(pk=self.kwargs['pk'], hospital=hospital)


# CleaningStaff Views
class CleaningStaffListCreateView(generics.ListCreateAPIView):
    queryset = CleaningStaff.objects.all()
    serializer_class = CleaningStaffSerializer
    permission_classes = [HospitalPermission, IsSuperiorOrManager]

    def get_queryset(self):
        # Filter cleaning staff based on the user's hospital
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return CleaningStaff.objects.filter(hospital=hospital)


class CleaningStaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CleaningStaff.objects.all()
    serializer_class = CleaningStaffSerializer
    permission_classes = [HospitalPermission]

    def get_object(self):
        # Ensure that the object belongs to the hospital of the requesting user
        user = self.request.user
        hospital = user.staff_member.hospital if hasattr(user, 'staff_member') else user.doctor_profile.hospital
        return CleaningStaff.objects.get(pk=self.kwargs['pk'], hospital=hospital)
