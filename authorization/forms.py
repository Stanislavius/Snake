from django import forms
class UserLoginForm(forms.Form):
    user = forms.CharField(label="Username")
    password = forms.CharField(label="Password", max_length=100)



