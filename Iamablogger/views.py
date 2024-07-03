from django.shortcuts import render, get_object_or_404
from django.views.generic import DetailView, ListView
from .models import BlogPost, Category, Subscriber
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings

def HomeView(request):
    blog_posts = BlogPost.objects.all()
    message=None
    if request.method == 'POST':
        email = request.POST.get('email')
        print(email)
        if email:
            subscriber, created = Subscriber.objects.get_or_create(email=email)
            if created:
                subscriber.save()
                message = "Subscription successful!"
            else:
                message = "You are already subscribed."
        else:
            message = "Please enter a valid email address."
    context = {'blog_posts': blog_posts, 'message':message}
    return render(request, 'home.html', context)

def BlogView(request):
    categories = Category.objects.all()
    blog_posts = BlogPost.objects.all()
    static_root = settings.STATIC_ROOT
    static_files_dirs = settings.STATICFILES_DIRS
    response = f'STATIC_ROOT: {static_root}<br>STATICFILES_DIRS: {static_files_dirs}'
    context = {'blog_posts': blog_posts, 'categories': categories, 'response':response}
    return render(request, 'blog.html', context)

def BlogPostView(request, posturl):
    blog_post = get_object_or_404(BlogPost, posturl=posturl)
    categories = Category.objects.all()
    
    context = {
        'blog_post': blog_post,
        'categories': categories,
    }
    
    return render(request, 'blog_post.html', context)
    
def AboutView(request):
    return render(request, 'about.html')

def ContactView(request):
    success_message=""
    if request.method == 'POST':
        fullname = request.POST.get('fullname')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('email_body')

        email_subject = f"Feedback: {subject}"
        email_body = f"Name: {fullname}\nEmail: {email}\nMessage:\n{message}"

        try:
            send_mail(
                email_subject,
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL],
                fail_silently=False, 
            )
            messages.success(request, "Thank you for reaching out! Your message has been sent.")
        except Exception as e:
            messages.error(request, "There was an error sending your message. Please try again later.")

        success_message="Thank you for reaching out! Your message has been sent. If required you will receive the response within 3 days."
    context = {'message': success_message}
    return render(request, 'contact.html', context)

def CategoryView(request, slug):
    category = get_object_or_404(Category, slug=slug)
    blog_posts = BlogPost.objects.filter(categories=category)
    
    context = {
        'category': category,
        'blog_posts': blog_posts,
    }
    
    return render(request, 'all_posts_in_category.html', context)