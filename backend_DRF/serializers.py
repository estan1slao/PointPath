from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
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
    #info = StudentSerializer(read_only=True)

    class Meta:
        model = Account
        fields = '__all__'

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