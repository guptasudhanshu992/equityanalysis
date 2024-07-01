from django.contrib import admin
from django.urls import path, re_path
from .views import HomeView, BlogView, AboutView, ContactView, BlogPostView, CategoryView
from django.views.generic import RedirectView
import re
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', HomeView, name='home_base'),
    path('home/', HomeView, name='home'),
    path('blog/', BlogView, name='blog'),
    path('about/', AboutView, name='about'),
    path('contact/', ContactView, name='contact'),
    path('blog/<slug:posturl>/', BlogPostView, name='blog_post'),
    path('blog/category/<slug:slug>/', CategoryView, name='all_posts_in_category'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)