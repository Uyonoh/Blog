from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from django.shortcuts import render

class CustomTokenObtainPairView(TokenObtainPairView):
    """Takes a set of user credentials and returns an access \
        and refresh JSON web token pair to prove the authentication \
        of those credentials."""
    serializer_class = CustomTokenObtainPairSerializer

def get_current_user(request):
    return JsonResponse(UserSerializer(request.user).data)