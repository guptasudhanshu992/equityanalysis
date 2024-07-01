from django.shortcuts import render, redirect
from .forms import SignUpForm, LoginForm
from .models import CustomUser
from django.contrib.auth import authenticate, login, logout
import logging

logger = logging.getLogger(__name__)

def SignupView(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(request, email=email, password=raw_password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                logger.error('User could not be authenticated after signup.')
                form.add_error(None, 'Signup was successful, but auto-login failed.')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def LoginView(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def AllUsers(request):
    all_users = CustomUser.objects.all()
    return render(request, 'users.html', {'users':all_users})

def LogoutView(request):
    logout(request)
    return redirect('login') 