from django.urls import path
from .rest_view import create_department_api,list_departments_by_hospital_api,create_doctor
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/create-department/', create_department_api, name='create_department_api'),
    path('departments/', list_departments_by_hospital_api, name='list_departments_by_hospital'),
    path('doctors_create/', create_doctor, name='create_doctor'),

]
