from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = settings.AUTH_USER_MODEL


class Student(models.Model):
    #student_id = models.IntegerField(primary_key=True, unique=True)
    #name = models.CharField(max_length=20)
    #surname = models.CharField(max_length=20)
    #patronymic = models.CharField(blank=True, max_length=20)
    #personal_email = models.EmailField(max_length=30)
    grade = models.CharField(max_length=4, null=True) #blank=True
    user = models.OneToOneField(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    #def __str__(self):
    #    return f"{self.surname} {self.name}"

@receiver(post_save, sender=User)
def create_student_profile(sender, instance, created, **kwargs):
    role = instance.role
    if created and role == "ученик":
        Student.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_student_profile(sender, instance, **kwargs):
    role = instance.role
    if role == "ученик":
        instance.student.save()


class Teacher(models.Model):
    #teacher_id = models.IntegerField(primary_key=True, unique=True)
    #name = models.CharField(max_length=20)
    #surname = models.CharField(max_length=20)
    #patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12, null=True) #CharField
    #personal_email = models.EmailField(max_length=30)
    discipline = models.TextField(null=True) #blank=True
    user = models.OneToOneField(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    #def __str__(self):
    #    return f"{self.surname} {self.name}"

@receiver(post_save, sender=User)
def create_teacher_profile(sender, instance, created, **kwargs):
    role = instance.role
    if created and role == "учитель":
        Teacher.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_teacher_profile(sender, instance, **kwargs):
    role = instance.role
    if role == "учитель":
        instance.teacher.save()


class Project(models.Model):
    topic = models.TextField()
    about = models.TextField()
    field_of_activity = models.TextField()
    student = models.ForeignKey('Student', on_delete=models.PROTECT, null=True)
    teacher = models.ForeignKey('Teacher', on_delete=models.PROTECT, null=True)
    state = models.IntegerField() # 0 - предложен проект кем-либо, 1 - принят, 2 - заверщен. Если проект отклонен - удалить строку
    #material_link = models.URLField() #? blank=True
    #user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.topic


class Tasks(models.Model):
    card_id = models.IntegerField(primary_key=True, unique=True)
    project_id = models.ForeignKey('Project', on_delete=models.PROTECT)
    category = models.CharField(max_length=50)
    task = models.TextField()
    description = models.TextField()

    def __str__(self):
        return self.task


class Comments(models.Model):
    card_id = models.ForeignKey('Tasks', on_delete=models.PROTECT)
    user_id = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return self.content


class Files(models.Model):
    card_id = models.ForeignKey('Tasks', on_delete=models.PROTECT)
    user_id = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)
    file = models.FileField()


class Account(AbstractUser):
    #id = models.IntegerField(primary_key=True, unique=True)
    role = models.CharField(max_length=20)
    patronymic = models.CharField(blank=True, max_length=20)
    phone_number = models.TextField(blank=True, max_length=12, null=True) #CharField
    telegram = models.TextField(blank=True, null=True)
    vk = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True, max_length=950)
    #login = models.TextField(unique=True)
    #password = models.CharField(max_length=15) #delete max_lenght=15

    def __str__(self):
        return f"Аккаунт пользователя {self.get_username()}"