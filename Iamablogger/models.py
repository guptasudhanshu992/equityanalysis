from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import User
import math
import PIL

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name
        
class BlogPost(models.Model):
    title = models.CharField(max_length=200, unique=True)
    posturl = models.SlugField(max_length=200, unique=True, blank=True)
    post_image_name = models.CharField(max_length=200, default="Image")
    post_image_alt = models.CharField(max_length=200, default="Image")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    published_datetime = models.DateTimeField(default=timezone.now)
    content = models.TextField()
    snippet = models.CharField(max_length=255, blank=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category, related_name='blog_posts')
    ordering = ['-published_datetime']
    
    def save(self, *args, **kwargs):
        if not self.posturl:
            self.posturl = slugify(self.title)
        super(BlogPost, self).save(*args, **kwargs)

    @property
    def number_of_words(self):
        return len(self.content.split())

    @property
    def reading_time(self):
        return math.ceil(self.number_of_words / 200)

    def __str__(self):
        return self.title