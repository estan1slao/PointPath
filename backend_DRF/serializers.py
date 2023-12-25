from django.contrib.auth.handlers.modwsgi import check_password
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers, status
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import *


class StudentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Student
        fields = "__all__"


class TeacherSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Teacher
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    other_user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
# class AccountSerializer(serializers.ModelSerializer):
#     #password = serializers.CharField(write_only=True, max_length=15)
#     class Meta:
#         model = Account
#         fields = "__all__"


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Account.objects.all())]
    )
    name = serializers.CharField(write_only=True, required=True, max_length=20)
    surname = serializers.CharField(write_only=True, required=True, max_length=20)
    patronymic = serializers.CharField(write_only=True, max_length=20)

    class Meta:
        model = Account
        fields = ('username', 'email', 'password', 'password2', 'role', 'name', 'surname', 'patronymic')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Account.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role'],
            first_name=validated_data['name'],
            last_name=validated_data['surname'],
            patronymic=validated_data['patronymic'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'password', 'username', 'first_name', 'last_name', 'email', 'role', 'patronymic', 'about',
                  'vk', 'telegram', 'phone_number')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        role = instance.role
        if role == "ученик":
            student = instance.student
            student_data = StudentSerializer(student).data
            representation['info'] = student_data
        else:
            teachers = instance.teacher
            teachers_data = TeacherSerializer(teachers).data
            representation['info'] = teachers_data

        return representation

    def update(self, instance, validated_data):
        if "password" in validated_data:
            raise serializers.ValidationError("Чтобы поменять пароль обратитесь по адресу: /update-password/")

        if "role" in validated_data:
            raise serializers.ValidationError("Невозможно поменять роль у пользователя.")

        if "username" in validated_data:
            raise serializers.ValidationError("Невозможно поменять username у пользователя.")

        if "email" in validated_data:
            raise serializers.ValidationError("Невозможно поменять email у пользователя.")

        validated_data.pop('role', None)
        validated_data.pop('username', None)
        validated_data.pop('email', None)
        validated_data.pop('password', None)

        return super(ProfileSerializer, self).update(instance, validated_data)


class TeacherOffersProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('topic', 'about', 'field_of_activity')

    def create(self, validated_data):
        user = self.context['request'].user
        if user.role == 'учитель':
            project = Project.objects.create(
                topic=validated_data['topic'],
                about=validated_data['about'],
                field_of_activity=validated_data['field_of_activity'],
                teacher=user.teacher,
                student=None,
                state=0
            )
            project.save()
            return project
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли учитель!")


class StudentGetProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class StudentChoosesProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['state', 'student']


class StudentOffersProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('topic', 'about', 'field_of_activity', 'teacher')

    def create(self, validated_data):
        user = self.context['request'].user
        if user.role == 'ученик':
            project = Project.objects.create(
                topic=validated_data['topic'],
                about=validated_data['about'],
                field_of_activity=validated_data['field_of_activity'],
                student=user.student,
                teacher=validated_data['teacher'],
                state=0
            )
            project.save()
            return project
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли ученик!")


class TeacherViewProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'topic', 'about', 'field_of_activity', 'student')


class TeacherAcceptsProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'state')


class CardsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tasks
        fields = "__all__"

    def create(self, validated_data):
        task = Tasks.objects.create(
            card_id=validated_data['card_id'],
            category=validated_data['category'],
            task=validated_data['task'],
            description=validated_data['description'],
            project=validated_data['project'],
        )

        task.save()
        return task

    def update(self, instance, validated_data):
        instance.card_id = validated_data.get("card_id", instance.card_id)
        instance.category = validated_data.get("category", instance.category)
        instance.task = validated_data.get("task", instance.task)
        instance.description = validated_data.get("description", instance.description)
        instance.project = validated_data.get("project", instance.project)
        instance.save()
        return instance


class CommentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comments
        fields = "__all__"
