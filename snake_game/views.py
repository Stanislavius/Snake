from django.shortcuts import render, redirect

# Create your views here.

from django.shortcuts import render

from django.views import View
from django.http import HttpResponse, HttpResponseRedirect

def game(request):
    if "user" not in request.session:
        return redirect("authorization:index")
    return render(request, "game.html")




