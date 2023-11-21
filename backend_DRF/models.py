from django.db import models


class Student(models.Model):
    student_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12)
    personal_email = models.EmailField(max_length=30)
    grade = models.CharField(max_length=4)

    def __str__(self):
        return f"{self.surname} {self.name}"


class Teacher(models.Model):
    teacher_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12)
    personal_email = models.EmailField(max_length=30)
    discipline = models.TextField()

    def __str__(self):
        return f"{self.surname} {self.name}"


class Project(models.Model):
    project_id = models.IntegerField(primary_key=True, unique=True)
    topic = models.TextField()
    student = models.ForeignKey('Student', on_delete=models.PROTECT)
    teacher = models.ForeignKey('Teacher', on_delete=models.PROTECT)
    material_link = models.URLField()

    def __str__(self):
        return self.topic


class Account(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)
    role = models.CharField(max_length=20)
    login = models.TextField(unique=True)
    password = models.CharField(max_length=15)

    def __str__(self):
        return f"Аккаунт пользователя {self.id}"