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

from backend_DRF import views
from backend_DRF.views import *

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'projects', ProjectViewSet)
#router.register(r'accounts', AccountViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/drf-auth/', include('rest_framework.urls')),
    path('api/v1/', include(router.urls)),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),

    # Profile
    path('profile/', views.getProfile, name='profile'),
    path('profile/update/', views.updateProfile, name='update-profile'),
    path('profile/update-password/', views.updatePassword, name='update-password'),

    #Tasks
    path('cards/', views.CardsView.as_view(), name='cards'),
    path('getcards/', views.getCards, name='get-Cards'),
    path('card/<int:pk>', views.CardUpdateView.as_view(), name='update-card')
]
