from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

# Create your views here.

from django.shortcuts import render

from django.views import View
from django.http import HttpResponse, HttpResponseRedirect

@login_required
def game(request):
    return render(request, "game.html")




