from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """Takes a set of user credentials and returns an access \
        and refresh JSON web token pair to prove the authentication \
        of those credentials."""
    serializer_class = CustomTokenObtainPairSerializer

def verify_email(request, url, *args, **kwargs):
    return True