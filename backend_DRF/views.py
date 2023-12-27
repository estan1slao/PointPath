from django.shortcuts import render
from rest_framework import viewsets, mixins, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.generics import CreateAPIView, GenericAPIView
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

  
class TeacherOffersProjectViewSet(mixins.CreateModelMixin,
                     GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = TeacherOffersProjectSerializer


class StudentGetProjectViewSet(mixins.ListModelMixin,
                                    GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = StudentGetProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(student_id__isnull=True)


class StudentChoosesProjectUpdateView(UpdateAPIView):
    queryset = Project.objects.filter(student_id__isnull=True)
    serializer_class = StudentChoosesProjectSerializer

    def update(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'ученик':
            instance = self.get_object()
            serializer = self.get_serializer(instance, data={'state': 1, 'student_id': user.id}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли ученик!")


class StudentOffersProjectViewSet(mixins.CreateModelMixin,
                     GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = StudentOffersProjectSerializer


class ViewingProposedProjectsViewSet(mixins.ListModelMixin,
                             GenericViewSet):
    queryset = Project.objects.filter(state=0)
    serializer_class = TeacherViewProjectsSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(teacher_id=user.teacher, state=0, student_id__isnull=False)


class DeletingOrAcceptingProject(mixins.UpdateModelMixin,
                                 mixins.DestroyModelMixin,
                                 GenericAPIView):
    queryset = Project.objects.filter(state=0)
    serializer_class = TeacherAcceptsProjectsSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(teacher_id=user.teacher, state=0, student_id__isnull=False)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'учитель':
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли учитель!")

    def update(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'учитель':
            instance = self.get_object()
            serializer = self.get_serializer(instance, data={'state': 1, 'id': self.get_object().id}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли учитель!")


class CardsView(generics.CreateAPIView):
    queryset = Tasks.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = CardsSerializer


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getCards(request):
        #user = request.user
        #project = Project.objects.raw("SELECT id FROM backend_DRF_project WHERE (student_id=%s OR teacher_id=%s)", [user.id, user.id])
        #cards = Tasks.objects.raw(
            #"SELECT card_id, category, task, description, project_id FROM backend_DRF_tasks WHERE project_id=%s", [project[0].project_id])
        cards = Tasks.objects.all()
        serializer = CardsSerializer(cards, many=True)
        return Response(serializer.data)


class CardUpdateView(APIView):
    def check(self, user_id, pk):
        project = Project.objects.raw(
            "SELECT id FROM backend_DRF_project WHERE (student_id=%s OR teacher_id=%s)", [user_id, user_id])
        if len(project) == 0:
            return Response({"message": "У вас нет доступа для удаления данных"})
        cards = Tasks.objects.raw(
            f"SELECT card_id FROM backend_DRF_tasks WHERE project_id=%s",
            [project[0].project_id])
        cards_id_list = [card.card_id for card in cards]
        if not (pk in cards_id_list):
            return Response({"message": "У вас нет доступа для удаления данных"})

    def put(self, request, *args, **kwargs):
        user_id = request.user.id
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Метод PUT не определён"})
        try:
            instance = Tasks.objects.get(card_id=pk)
        except:
            return Response({"error": "Объект не найден"})
        self.check(user_id, pk)
        serializer = CardsSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"post": serializer.data})

    def delete(self, request, *args, **kwargs):
        user_id = request.user.id
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Метод delete не определён"})
        self.check(user_id, pk)
        Tasks.objects.filter(card_id=pk).delete()
        return Response({"post": "delete card " + str(pk)})


class CommentsView(generics.CreateAPIView):
    queryset = Comments.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = CommentsSerializer


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getComments(request, *args, **kwargs):
        card = kwargs.get("card", None)
        if not card:
            return Response({"error": "Метод GET не определён"})
        comments = Comments.objects.raw(
            "SELECT id, content, card_id, user_id FROM backend_DRF_comments WHERE card_id=%s", [card])
        serializer = CommentsSerializer(comments, many=True)
        return Response(serializer.data)

