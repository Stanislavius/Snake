from django.db import models

class User(models.Model):
    user = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    email = models.EmailField(('Email Address'), max_length=50, unique=True)
    class Meta:
        db_table = "User"

class Score(models.Model):
    user = models.CharField(max_length=30)
    score = models.IntegerField()
    class Meta:
        db_table = "Score"