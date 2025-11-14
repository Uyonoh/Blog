from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from .validators import strip, add_c

# Custom register method inherits TokenObtainPairSerializer and Registerserisalizers,
# after register, get and return tokens

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["user"] = UserSerializer(user).data
        return token
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_staff"]

class CustomRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100, min_length=1, required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_username(self, username :str, validators = None):
        # Add validators (func list)
        if validators is not None:
            validators = validators
        else:
            validators = [strip]
        # strip, length, unique?, 

        for func in validators:
            username :str = func(username)
        return username
    
    def validate_email(self, email :str, validators = None):
        # Add validators (func list)
        if validators is not None:
            validators = validators
        else:
            validators = [strip, add_c]
        # strip, length, unique?, 
        print("VA;IDATING MAIL...")
        for func in validators:
            email :str = func(email)

        # raise serializers.ValidationError(
        #             _('A user is already registered with this e-mail address.'),
        #         )
        return email
    
    def validate_password1(self, password: str, validators=None):
        """ Only validate one password """
        if validators is not None:
            validators = validators
        else:
            validators = []

        for func in validators:
            password :str = func(password)
        return password
    
    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data
    
    def get_cleaned_data(self):
        username = self.validated_data.get("username", "")
        email = self.validated_data.get("email", "")
        password1 = self.validated_data.get("password1", "")

        return {
            # "id": 20,
            "username": username,
            "email": email,
            "password": password1,
            }
    
    def save(self, request):
        print("getting cleaned data...")
        self.cleaned_data = self.get_cleaned_data()
        print(f"Cleaned data: {self.cleaned_data}")
        data = self.cleaned_data

        user = User()
        user.username = data.get("username")
        user.email = data.get("email")
        user.set_password(data.get("password"))

        user.save()

        return user