from django.urls import path
from .rest_view import list_disease_history_for_hospital  # Import the new view

urlpatterns = [
    path('disease-history/', list_disease_history_for_hospital, name='list_disease_history_for_hospital'),  # New endpoint
]
