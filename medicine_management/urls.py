from django.urls import path
from .rest_view import Medicine_View
from .rest_view import Medicine_List_View_from_other_hospitals
urlpatterns=[
    path('api/medicine_view/',Medicine_View.as_view(), name='medicine_view'),
    path('api/medicine_from_nearbyhospital/',Medicine_List_View_from_other_hospitals.as_view(),name='medicine_from_nearbyhospital'),

]
