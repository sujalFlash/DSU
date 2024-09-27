from django.urls import path
from .rest_view import Medicine_View
urlpatterns=[
    path('api/medicine_view/',Medicine_View.as_view(), name='medicine_view'),
]