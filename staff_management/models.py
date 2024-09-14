from django.db import models
from hospital_management.models import Hospital
from django.contrib.auth.models import AbstractUser
class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="departments")

    def __str__(self):
        return self.name
class CustomUser(AbstractUser):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='users', null=True, blank=True)
class Doctor(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile',default=1)
    STATUS_CHOICES = [
        ('free', 'Free'),
        ('consulting', 'Consulting'),
        ('on_leave', 'On Leave'),
    ]
    SHIFT_CHOICES = [
        ('Day', 'Day'),
        ('Night', 'Night'),
        ('Rotating', 'Rotating'),
    ]
    employee_id = models.CharField(max_length=10, unique=True,default="not_assigned")
    name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
    departments = models.ManyToManyField(Department, related_name="doctors")  # Multiple departments
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="doctors")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='free')
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='Day')
    on_duty=models.BooleanField(default=False)
    def __str__(self):
        return self.name

class StaffMember(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='staff_member',default=1)
    employee_id = models.CharField(max_length=10, unique=True,default="not_assigned")
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    STATUS_CHOICES = [
        ('free', 'Free'),
        ('working', 'Working'),
        ('on_leave', 'On Leave'),
    ]
    SHIFT_CHOICES = [
        ('Day', 'Day'),
        ('Night', 'Night'),
        ('Rotating', 'Rotating'),
    ]
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='Day')
    departments = models.ManyToManyField(Department, related_name="staff_members")  # Multiple departments
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="staff_members")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='free')
    is_in_hospital = models.BooleanField(default=False)
    on_duty=models.BooleanField(default=False)
    class Meta:
        unique_together = ('name', 'hospital', 'role')

    def __str__(self):
        return self.name

class NursingStaff(StaffMember):
    qualifications = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Nurse: {self.name}"

class ReceptionStaff(StaffMember):
    desk_assigned = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Receptionist: {self.name}"

class CleaningStaff(StaffMember):
    area_assigned = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Cleaner: {self.name}"

class WorkManager(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='manager',default=1)
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    role=models.CharField(max_length=100,default='manager')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="work_manager",default=1)
    staff_members = models.ManyToManyField(StaffMember, through='WorkAssignment')
    def __str__(self):
        return f"{self.name}"

class WorkAssignment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='work',default=1)
    staff_member = models.ForeignKey(StaffMember, on_delete=models.CASCADE)
    work_manager = models.ForeignKey(WorkManager, on_delete=models.CASCADE)
    work_name = models.CharField(max_length=100)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="work_assignments",default=1)
    assigned_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.work_manager}:+{self.work_name}:{self.staff_member} start date:{self.assigned_date} end date:{self.end_date}"

