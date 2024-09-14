from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

from .models import Doctor, Hospital
from .permissions import HospitalPermission  # Import your permission class if needed


class DoctorViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.hospital = Hospital.objects.create(name="Test Hospital")
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)  # Authenticate the user
        self.doctor = Doctor.objects.create(name="Dr. Alice", hospital=self.hospital)

    def test_get_doctor_list(self):
        url = reverse('doctor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'Dr. Alice')  # Verify response contains expected doctor

    def test_create_doctor(self):
        url = reverse('doctor-list')
        data = {'name': 'Dr. John', 'hospital': self.hospital.id}
        response = self.client.post(url, data, format='json')  # Ensure data format is correct
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Doctor.objects.count(), 2)  # Verify doctor was created

    def test_get_doctor_detail(self):
        url = reverse('doctor-detail', kwargs={'pk': self.doctor.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'Dr. Alice')  # Verify response contains doctor's name

    def test_update_doctor(self):
        url = reverse('doctor-detail', kwargs={'pk': self.doctor.id})
        data = {'name': 'Dr. Alice Updated'}
        response = self.client.put(url, data, format='json')  # Ensure data format is correct
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.doctor.refresh_from_db()
        self.assertEqual(self.doctor.name, 'Dr. Alice Updated')  # Verify update was successful

    def test_delete_doctor(self):
        url = reverse('doctor-detail', kwargs={'pk': self.doctor.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Doctor.objects.count(), 0)  # Verify doctor was deleted
