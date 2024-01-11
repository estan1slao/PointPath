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
            serializer = self.get_serializer(instance, data={'state': 1, 'student': user.student.id}, partial=True)
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
            serializer = self.get_serializer(instance, data={'state': 1, 'id': user.teacher.id}, partial=True)
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
def getCards(request, *args, **kwargs):
        project_id = kwargs.get("project_id", None)
        if not project_id:
            return Response({"error": "Метод get не определён"})
        cards = Tasks.objects.raw(
            "SELECT card_id, category, task, description, project_id FROM backend_DRF_tasks WHERE project_id=%s", [project_id])
        if not cards:
            return Response({"error": "Нельзя просмотреть чужие карточки / Такого проекта несуществует"})
        #cards = Tasks.objects.all()
        serializer = CardsSerializer(cards, many=True)
        return Response(serializer.data)


class CardUpdateView(APIView):
    def check(self, user, project_id, pk):
        if user.role == 'ученик':
            students = Student.objects.filter(user_id=user.id)
            projects = Project.objects.filter(student_id=students[0].id)
        elif user.role == 'учитель':
            teachers = Teacher.objects.filter(user_id=user.id)
            projects = Project.objects.filter(teacher_id=teachers[0].id)
        else:
            return False
        if projects.filter(id=project_id).exists():
            cards = Tasks.objects.raw(
                f"SELECT card_id FROM backend_DRF_tasks WHERE project_id=%s",
                [project_id])
            cards_id_list = [card.card_id for card in cards]
            return pk in cards_id_list
        return False

    def put(self, request, *args, **kwargs):
        user = request.user
        project_id = kwargs.get("project_id", None)
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Метод PUT не определён"})
        if not project_id:
            return Response({"error": "Метод PUT не определён"})
        try:
            instance = Tasks.objects.get(card_id=pk)
        except:
            return Response({"error": "Объект не найден"})
        if not (self.check(user, project_id, pk)):
            return Response({"error": "Проект не найден!"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CardsSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"post": serializer.data})

    def delete(self, request, *args, **kwargs):
        user = request.user
        pk = kwargs.get("pk", None)
        project_id = kwargs.get("project_id", None)
        if not pk:
            return Response({"error": "Метод delete не определён"})
        if not (self.check(user, project_id, pk)):
            return Response({"error": "Проект не найден!"}, status=status.HTTP_400_BAD_REQUEST)
        Comments.objects.filter(card_id=pk).delete()
        Tasks.objects.filter(card_id=pk).delete()
        return Response({"post": "delete card " + str(pk)})

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


class DescriptionTeacherIDView(APIView):
    def get(self, request, teacher_id):
        user_id_teacher = Teacher.objects.filter(id=teacher_id).values_list('user', flat=True)
        if not user_id_teacher:
            return Response({"error": "Не найден учитель по предложенному teacher_id"},
                            status=status.HTTP_404_NOT_FOUND)

        account_description = Account.objects.filter(id=user_id_teacher[0])
        if not account_description:
            return Response({"error": "Не найден аккаунт по предложенному teacher_id"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = DescriptionTeacherIDAndStudentIDSerializer(account_description, many=True)
        return Response(serializer.data)


class DescriptionStudentIDView(APIView):
    def get(self, request, student_id):
        user_id_student = Student.objects.filter(id=student_id).values_list('user', flat=True)
        if not user_id_student:
            return Response({"error": "Не найден ученик по предложенному student_id"},
                            status=status.HTTP_404_NOT_FOUND)

        account_description = Account.objects.filter(id=user_id_student[0])
        if not account_description:
            return Response({"error": "Не найден аккаунт по предложенному student_id"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = DescriptionTeacherIDAndStudentIDSerializer(account_description, many=True)
        return Response(serializer.data)


class CreateCommentsView(APIView):
    # {
    #     "card_id": <int>,
    #     "content": ""
    # }
    def post(self, request):
        user = request.user
        cards_ids = []
        if (user.role == 'ученик'):
            student_id = Student.objects.get(user_id=user.id).id
            projects = Project.objects.filter(student_id=student_id)
            if len(projects) == 0:
                return Response({"error": "Проект не выбран!"}, status=status.HTTP_400_BAD_REQUEST)
            for project in projects:
                cards = Tasks.objects.filter(project_id=project.id)
                cards_ids.extend([card.card_id for card in cards])
        elif (user.role == 'учитель'):
            teacher_id = Teacher.objects.get(user_id=user.id).id
            projects = Project.objects.filter(teacher_id=teacher_id)
            if len(projects) == 0:
                return Response({"error": "Проекты не выбраны!"}, status=status.HTTP_400_BAD_REQUEST)
            for project in projects:
                cards = Tasks.objects.filter(project_id=project.id)
                cards_ids.extend([card.card_id for card in cards])
        else:
            return Response({"error": "Ошибка в роли пользователя!"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            tasks = Tasks.objects.filter(card_id__in=cards_ids)
        except Tasks.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_400_BAD_REQUEST)

        for task in tasks:
            if (request.data['card_id'] == task.card_id):
                comment = Comments.objects.create(
                    card=task,
                    user=user,
                    content=request.data['content'],
                    first_name_proponent=user.first_name,
                    last_name_proponent=user.last_name,
                    patronymic_proponent=user.patronymic,
                )
                comment.save()
                return Response({"message": "Комментарий успешно создан"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Задача не найдена или недоступна для редактирования"}, status=status.HTTP_400_BAD_REQUEST)


class GetActiveProjectForStudentAndTeacherView(APIView):
    def get(self, request):
        user = request.user
        if (user.role == 'ученик'):
            user_id_student = Student.objects.filter(user_id=user.id)
            if not user_id_student:
                return Response({"error": "Не найден ученик в таблице student"},
                                status=status.HTTP_400_BAD_REQUEST)

            project_description = Project.objects.filter(student_id=user_id_student[0], state=1)
            if not project_description:
                return Response({"error": "Не найден активный проект у ученика"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = ActiveProjectStudentSerializer(project_description, many=True)
        elif (user.role == 'учитель'):
            user_id_teacher = Teacher.objects.filter(user_id=user.id)
            if not user_id_teacher:
                return Response({"error": "Не найден учитель в таблице teacher"},
                                status=status.HTTP_400_BAD_REQUEST)

            project_description = Project.objects.filter(teacher_id=user_id_teacher[0], state=1)
            if not project_description:
                return Response({"error": "Не найдены активные проекты у учеников"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = ActiveProjectsTeacherSerializer(project_description, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Не найдена роль аккаунта"},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class GetAllTeachersView(APIView):
    def get(self, request):
        teachers = Account.objects.filter(role='учитель')
        serializer = GetAllTeacherSerializer(teachers, many=True)
        return Response(serializer.data)


def uploadFile(request):
    all_files = Files.ojects.all()
    context = {
        'all_files': all_files
    }

    if request.POST:
        file = Files.objects.create(
            card=request.POST.get('card'),
            file=request.FILES.get('file')
        )
        file.save()
        return render(request)

class CompletionOfProjectByTeacherView(APIView):
    def check(self, user, project_id):
        if user.role == 'учитель':
            teachers = Teacher.objects.filter(user_id=user.id)
            projects = Project.objects.filter(teacher_id=teachers[0].id)
        else:
            return False
        return projects.filter(id=project_id).exists()

    def put(self, request, *args, **kwargs):
        user = request.user
        project_id = kwargs.get("project_id", None)
        if not project_id:
            return Response({"error": "Метод UPDATE не определён"})
        if user.role == 'учитель':
            try:
                instance = Project.objects.get(id=project_id)
            except:
                return Response({"error": "Объект не найден"})
            if not (self.check(user, project_id)):
                return Response({"error": "Невозможно завершить чужой проект!"})
            serializer = CompletionOfProjectSerializer(instance, data={'state': 2}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            raise serializers.ValidationError("Пользователь должен принадлежать роли учитель!")

class GetCompletedProjectsView(APIView):
    def get(self, request):
        user = request.user
        if (user.role == 'ученик'):
            user_id_student = Student.objects.filter(user_id=user.id)
            if not user_id_student:
                return Response({"error": "Не найден ученик в таблице student"},
                                status=status.HTTP_400_BAD_REQUEST)

            project_description = Project.objects.filter(student_id=user_id_student[0], state=2)
            if not project_description:
                return Response({"error": "Не найдены завершенные проекты у ученика"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = CompletedProjectsSerializer(project_description, many=True)
        elif (user.role == 'учитель'):
            user_id_teacher = Teacher.objects.filter(user_id=user.id)
            if not user_id_teacher:
                return Response({"error": "Не найден учитель в таблице teacher"},
                                status=status.HTTP_400_BAD_REQUEST)

            project_description = Project.objects.filter(teacher_id=user_id_teacher[0], state=2)
            if not project_description:
                return Response({"error": "Не найдены завершенные проекты у учеников"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = CompletedProjectsSerializer(project_description, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Не найдена роль аккаунта"},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)
