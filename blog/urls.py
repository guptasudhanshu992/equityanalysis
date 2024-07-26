from django.urls import path, include
from .views import Index, DetailArticleView, LikeArticleView, FeaturedView, DeleteArticleView

urlpatterns = [
    path('tinymce/', include('tinymce.urls')),
    path('', Index.as_view(), name='index'),
    path('<int:pk>', DetailArticleView.as_view(), name='detail_article'),
    path('<int:pk>/like', LikeArticleView.as_view(), name='like_article'),
    path('featured/', FeaturedView.as_view(), name='featured'),
    path('<int:pk>/delete', DeleteArticleView.as_view(), name='delete_article'),
]
