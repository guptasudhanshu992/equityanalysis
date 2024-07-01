from django.contrib import admin
from django.urls import path
from .views import SignupView, LoginView, AllUsers, LogoutView

urlpatterns = [
    path('signup', SignupView, name='signup'),
    path('login', LoginView, name='login'),
    path('users', AllUsers, name='users'),
    path('logout', LogoutView, name='logout'),
]