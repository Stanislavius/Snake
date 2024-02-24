import datetime

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect

from .models import User, Score
from .forms import UserLoginForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

def index(request):
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    request.session['last_activity'] = current_time
    print(request.user)
    if request.user.is_authenticated == True and 'next' in request.GET and request.GET['next'] != "":
        return HttpResponseRedirect(request.GET['next'])
    if request.user.is_authenticated:
        return redirect("game:game")
    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = request.POST['user']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            print(request.user)
            print(user)
            if user is not None:
                login(request, user)
                return redirect("game:game")
            else:
                return HttpResponse("Wrong user or password")
    else:
        form = UserLoginForm()
        return render(request, "UserLogin.html", {"form": form})

def signup(request):
    if request.user.is_authenticated:
        return redirect("game:game")
    if request.method == "POST":
        username = request.POST['user']
        password = request.POST['password']
        user = User.objects.create_user(username, "", password)
        return redirect("authorization:index")
    else:
        form = UserLoginForm()
        return render(request, "registration.html", {"form": form})

def exit(request):
    logout(request)
    return redirect("authorization:index")

@login_required
def show_scores(request):
    MODEL_HEADERS=[f.name for f in Score._meta.get_fields()]
    query_results = [list(i.values()) for i in list(Score.objects.all().order_by('-score').values())]
    return render(request, "Scores_show.html", {
            "query_results" : query_results,
            "model_headers" : MODEL_HEADERS
        })