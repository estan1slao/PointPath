"""
URL configuration for pointPath_django_main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from backend_DRF import views
from backend_DRF.views import *

#Project URL
router = routers.DefaultRouter()
router.register(r'teacher-offers-project', TeacherOffersProjectViewSet)
router.register(r'student-get-projects', StudentGetProjectViewSet)
router.register(r'student-offers-project', StudentOffersProjectViewSet)
router.register(r'teacher-viewing-proposed-projects', ViewingProposedProjectsViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/v1/drf-auth/', include('rest_framework.urls')),
    # path('api/v1/', include(router.urls)),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),

    # Profile
    path('profile/', views.getProfile, name='profile'),
    path('profile/update/', views.updateProfile, name='update-profile'),
    path('profile/update-password/', views.updatePassword, name='update-password'),

    # Project
    path('projects/get-active/', GetActiveProjectForStudentAndTeacherView.as_view(), name='get-active-projects'),
    path('projects/', include(router.urls)),
    path('projects/student-choose-project/<int:pk>/', StudentChoosesProjectUpdateView.as_view(), name='choose-project'),
    path('projects/teacher-denied-project/<int:pk>/', DeletingOrAcceptingProject.as_view(), name='delete_project'),
    path('projects/teacher-accept-project/<int:pk>/', DeletingOrAcceptingProject.as_view(), name='update_project'),
    path('projects/get-completed/', GetCompletedProjectsView.as_view(), name='get-completed-projects'),
    path('projects/complete/<int:project_id>/', CompletionOfProjectByTeacherView.as_view(), name='complete-project'),

    #Tasks
    path('cards/', views.CardsView.as_view(), name='save-cards'),
    path('getcards/<int:project_id>/', views.getCards, name='get-Cards'),
    path('card/<int:project_id>/<int:pk>/', views.CardUpdateView.as_view(), name='update-card'),

    #Comments
    path('comments/<int:card>/', views.getComments, name='get-comments'),
    path('comments/create/', CreateCommentsView.as_view(), name='create-comments'),
    # {
    #     "card_id": null,
    #     "content": ""
    # }

    # Information on student_id and teacher_id
    path('about-teacher/<int:teacher_id>/', DescriptionTeacherIDView.as_view(), name='description_teacher_id'),
    path('about-student/<int:student_id>/', DescriptionStudentIDView.as_view(), name='description_student_id'),
    path('about-teacher/all/', GetAllTeachersView.as_view(), name='get_teachers'),
    #Files
    path('files/', views.uploadFile, name='upload-file')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

