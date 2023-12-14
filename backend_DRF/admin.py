from django.contrib import admin

from .models import Student, Teacher, Account, Project

admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Account)
admin.site.register(Project)
