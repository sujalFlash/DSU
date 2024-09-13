from django.contrib import admin
from .models import Doctor,StaffMember,ReceptionStaff,NursingStaff,CleaningStaff,Department,WorkManager,WorkAssignment
admin.site.register(Department)
admin.site.register(Doctor)
admin.site.register(StaffMember)
admin.site.register(ReceptionStaff)
admin.site.register(NursingStaff)
admin.site.register(CleaningStaff)
admin.site.register(WorkManager)
admin.site.register(WorkAssignment)

