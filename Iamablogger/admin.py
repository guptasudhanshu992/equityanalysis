from django.contrib import admin
from .models import BlogPost, Category, Subscriber

class BlogPostAdmin(admin.ModelAdmin):
    prepopulated_fields = {'posturl': ('title',)}
    
admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(Category)
admin.site.register(Subscriber)