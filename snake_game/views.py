from django.shortcuts import render

# Create your views here.

from django.shortcuts import render

from django.views import View
from django.http import HttpResponse, HttpResponseRedirect

def game(request):
    return render(request, "game.html")


