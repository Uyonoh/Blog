from django.urls import path, include
from .views import (
    LoginSetCookieView, 
    RefreshFromCookieView, 
    LogoutView, 
    get_csrf_token,
    get_current_user,
    )


app_name = "users"

urlpatterns = [
    path("login/", LoginSetCookieView.as_view(), name="token_obtain_pair_cookie"),
    path("refresh/", RefreshFromCookieView.as_view(), name="token_refresh_cookie"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('csrf/', get_csrf_token),
    path('user/', get_current_user, name='current_user'),
    # your API endpoints...
]