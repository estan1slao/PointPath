from django.shortcuts import render
from rest_framework import viewsets, mixins, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

# from django.conf import settings
# User = settings.AUTH_USER_MODEL

from .models import *
from .permissions import *
from .serializers import *


# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsOwnerOrReadOnly, IsAdminUser]


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = (IsOwnerOrReadOnly, )


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsOwnerAndIsOtherUser,)


# class AccountViewSet(viewsets.ModelViewSet):
#     queryset = Account.objects.all()
#     serializer_class = AccountSerializer
#     permission_classes = (AllowAny,)

#Login User
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#Register User
class RegisterView(generics.CreateAPIView):
    queryset = Account.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# api/profile  and api/profile/update
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = ProfileSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    user = request.user
    serializerAccount = ProfileSerializer(user, data=request.data, partial=True)
    if not request.data.get('info') is None:
        if (user.role == "ученик"):
            student = user.student
            serializerOther = StudentSerializer(student, data=request.data.get('info'), partial=True)
        elif (user.role == "учитель"):
            teacher = user.teacher
            serializerOther = TeacherSerializer(teacher, data=request.data.get('info'), partial=True)
        else:
            return Response({"error": "Роль пользователя не определена."}, status=status.HTTP_400_BAD_REQUEST)

    if not request.data.get('info') is None and serializerOther.is_valid():
        if (user.role == "ученик"):
            serializerOther.update(student, serializerOther.validated_data)
        elif (user.role == "учитель"):
            serializerOther.update(teacher, serializerOther.validated_data)
        else:
            return Response({"error": "Роль пользователя не определена."}, status=status.HTTP_400_BAD_REQUEST)

    if serializerAccount.is_valid():
        serializerAccount.update(user, serializerAccount.validated_data)
        return Response({"message": "Информация успешно обновлена."}, status=status.HTTP_200_OK)
    return Response(serializerAccount.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updatePassword(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('password')

    if not user.check_password(current_password):
        return Response({"error": "Неверный текущий пароль."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Пароль успешно обновлен."}, status=status.HTTP_200_OK)


class CardsView(generics.CreateAPIView):
    queryset = Tasks.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = CardsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCards(request):
    if request.method == 'GET':
        user = request.user
        project_id = Project.objects.raw("SELECT project_id FROM backend_DRF_project WHERE user_id=%s", [user.id])
        cards = Tasks.objects.raw(
            f"SELECT card_id, category, task, description, project_id FROM backend_DRF_tasks WHERE project_id=%s", [project_id])
        serializer = CardsSerializer(cards)
        return Response({'post': serializer.data})
