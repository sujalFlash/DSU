from django.urls import path
from .rest_view import list_disease_history_for_hospital  # Import the new view
from .rest_view import update_disease_history
urlpatterns = [
    path('disease-history/', list_disease_history_for_hospital, name='list_disease_history_for_hospital'),
 path('disease-history/<int:pk>/', update_disease_history, name='update_disease_history'),
]
