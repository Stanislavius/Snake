from django.contrib import admin
from django.urls import path
from . import views

app_name = "authorization"
urlpatterns = [
    path('', views.index, name = "index"),
    path('signup', views.signup, name = "signup"),
    path('exit', views.exit, name = "exit"),
    path('show_scores', views.show_scores, name = "show_scores"),
    path('add_score', views.add_score, name = "add_score"),
]