"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView
from .views import get_current_user, CustomTokenObtainPairView


from django.http import JsonResponse
    

urlpatterns = [
    path('admin/', admin.site.urls),
    # Social authentication URLs
    # path('auth/', include('allauth.urls')),
    # path('auth/login/', LoginView.as_view(), name='login'),
    # path('auth/logout/', LogoutView.as_view(), name='logout'),
    # path('auth/register/', RegisterView.as_view(), name='register'),
    # path('auth/user/', get_current_user, name='current_user'),
    # path('auth/csrf/', get_csrf_token),
    path('auth/', include('users.urls')),
    path('', include('blog_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


from rest_framework_simplejwt import views as jwt_views

urlpatterns.extend([
    path('auth/token/',
         CustomTokenObtainPairView.as_view(),
         name ='token_obtain_pair'),
    path('auth/token/refresh/',
         jwt_views.TokenRefreshView.as_view(),
         name ='token_refresh'),
    # path('', include('app.urls')),
])