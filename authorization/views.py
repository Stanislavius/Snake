from django.http import HttpResponse
from django.shortcuts import render, redirect

from .models import User, Score
from .forms import UserLoginForm

def index(request):
    print(request.session)
    if "user" in request.session:
        return redirect("game:game")
    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            user = request.POST['user']
            password = request.POST['password']
            if User.objects.filter(user = user).exists():
                if User.objects.filter(user = user,password = password).exists():
                    request.session['user'] = user
                    return redirect("game:game")
                return HttpResponse("Wrong password")
            else:
                return HttpResponse("No such user")
    else:
        form =  UserLoginForm()
        return render(request, "UserLogin.html", {"form": form})

def signup(request):
    if "user" in request.session:
        return redirect("game:game")
    if request.method == "POST":
        user = request.POST['user']
        password = request.POST['password']
        if User.objects.filter(user=user).exists() == False:
            record = User(user=user, password=password)
            record.save()
            request.session['user'] = user
            return redirect("game:game")
        else:
            return HttpResponse("You can not sign up as this user: user already exists")
    else:
        form = UserLoginForm()
        return render(request, "registration.html", {"form": form})

def exit(request):
    print("EXIT")
    del request.session["user"]
    return redirect("authorization:index")

def show_scores(request):
    MODEL_HEADERS=[f.name for f in Score._meta.get_fields()]
    query_results = [list(i.values()) for i in list(Score.objects.all().values())]
    return render(request, "Scores_show.html", {
            "query_results" : query_results,
            "model_headers" : MODEL_HEADERS
        })