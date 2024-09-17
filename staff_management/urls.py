from django.urls import path
from .rest_view import create_department_api, list_departments_by_hospital_api, DoctorCreateView,view_doctors,get_user_departments
from .rest_view import delete_doctor,view_nurses,CustomUserCreativeView,add_nurses,delete_nurse,CleanerCreateView,view_cleaners,delete_cleaners
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/create-department/', create_department_api, name='create_department_api'),
    path('departments/', list_departments_by_hospital_api, name='list_departments_by_hospital'),
    path('api/create_customUser/doctors_create/', DoctorCreateView.as_view(), name='create_doctor'),
    path('api/view_doctors/',view_doctors,name='view_doctors'),
    path('api/view_department/',get_user_departments,name='get_user_departments'),
    path('api/delete_doctor/<int:pk>/',delete_doctor,name='delete_doctor'),
    path('api/view_nurses/',view_nurses,name="view_nurses"),
    path('api/create_customUser/',CustomUserCreativeView.as_view(),name='create_customUser'),
    path('api/create_customUser/add_nurse/',add_nurses,name="add_nurses"),
    path('api/delete_nurse/<int:pk>/',delete_nurse,name='delete_nurse'),
    path('api/create_customUser/add_cleaner/',CleanerCreateView.as_view(),name="add_cleaner"),
    path('api/view_cleaners/',view_cleaners,name="view_cleaners"),
    path('api/delete_cleaner/<int:pk>/',delete_cleaners,name="delete_cleaner"),

]
