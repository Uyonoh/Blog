from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

# Create your views here.
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
    
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({
        'detail': 'CSRF cookie set',
        'csrfToken': get_token(request),
    })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET']) # Specifies this view only accepts GET requests
@permission_classes([permissions.IsAuthenticated]) # Ensures the user is authenticated
def get_current_user(request):
    """
    Returns the current authenticated user's details.
    """
    # The request.user is guaranteed to be a valid, authenticated user 
    # because of the IsAuthenticated permission class.
    user = request.user
    serializer = UserSerializer(user)
    
    print(f"USER = {serializer.data}")
    
    # Use DRF's Response object for correct API rendering
    return Response(serializer.data, status=status.HTTP_200_OK)

class LoginSetCookieView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        refresh = data.get("refresh")
        access = data.get("access")

        response = Response({"access_token": access})

        if refresh:
            # Set cookie attributes based on settings
            response.set_cookie(
                settings.REFRESH_COOKIE_NAME,
                refresh,
                secure=settings.REFRESH_COOKIE_SECURE,
                httponly=settings.REFRESH_COOKIE_HTTPONLY,
                samesite=settings.REFRESH_COOKIE_SAMESITE,
                path=settings.REFRESH_COOKIE_PATH,
                max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
        else:
            print("No refresh token")
        
        # Remove refresh token from JSON response
        data.pop("refresh", None)

        return response

class RefreshFromCookieView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cookie = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)

        if not cookie:
            return Response({"detail": "No refresh token cookie"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = RefreshToken(cookie)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

         # Optionally rotate: create new refresh token
        new_refresh = token.rotate() if hasattr(token, "rotate") else None

        access_token = token.access_token
        res = Response({"access_token": str(access_token)}, status=status.HTTP_200_OK)

        if new_refresh:
            # set new refresh cookie (rotation)
            res.set_cookie(
                settings.REFRESH_COOKIE_NAME,
                str(new_refresh),
                secure=settings.REFRESH_COOKIE_SECURE,
                httponly=settings.REFRESH_COOKIE_HTTPONLY,
                samesite=settings.REFRESH_COOKIE_SAMESITE,
                path=settings.REFRESH_COOKIE_PATH,
                max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
        return res
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Blacklist refresh cookie token (if using rotate/blacklist)
        cookie = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if cookie:
            try:
                token = RefreshToken(cookie)
                token.blacklist()
            except Exception:
                pass

        res = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        # delete cookie
        res.delete_cookie(settings.REFRESH_COOKIE_NAME, path=settings.REFRESH_COOKIE_PATH)
        return res