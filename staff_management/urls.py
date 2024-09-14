from django.urls import path
from .rest_view import DoctorListCreateView, DoctorDetailView
from .rest_view import NursingStaffListCreateView, NursingStaffDetailView
from .rest_view import ReceptionStaffListCreateView, ReceptionStaffDetailView
from .rest_view import CleaningStaffListCreateView, CleaningStaffDetailView

urlpatterns = [
    path('doctors/', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),

    path('nursing_staff/', NursingStaffListCreateView.as_view(), name='nursing-staff-list-create'),
    path('nursing_staff/<int:pk>/', NursingStaffDetailView.as_view(), name='nursing-staff-detail'),

    path('reception_staff/', ReceptionStaffListCreateView.as_view(), name='reception-staff-list-create'),
    path('reception_staff/<int:pk>/', ReceptionStaffDetailView.as_view(), name='reception-staff-detail'),

    path('cleaning_staff/', CleaningStaffListCreateView.as_view(), name='cleaning-staff-list-create'),
    path('cleaning_staff/<int:pk>/', CleaningStaffDetailView.as_view(), name='cleaning-staff-detail'),
]
