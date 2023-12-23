from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

from django.contrib.auth import get_user_model
User = settings.AUTH_USER_MODEL


class Student(models.Model):
    student_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12) #CharField
    personal_email = models.EmailField(max_length=30)
    grade = models.CharField(max_length=4) #blank=True
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return f"{self.surname} {self.name}"


class Teacher(models.Model):
    teacher_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12) #CharField
    personal_email = models.EmailField(max_length=30)
    discipline = models.TextField() #blank=True
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return f"{self.surname} {self.name}"


class Project(models.Model):
    project_id = models.IntegerField(primary_key=True, unique=True)
    topic = models.TextField()
    student = models.ForeignKey('Student', on_delete=models.PROTECT)
    teacher = models.ForeignKey('Teacher', on_delete=models.PROTECT)
    material_link = models.URLField() #? blank=True
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.topic


class Account(AbstractUser):
    #id = models.IntegerField(primary_key=True, unique=True)
    role = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    #login = models.TextField(unique=True)
    #password = models.CharField(max_length=15) #delete max_lenght=15

    def __str__(self):
        return f"Аккаунт пользователя {self.get_username()}"