from django import forms

class SignInForm(forms.Form):
    user = forms.CharField(label="User", max_length=100)
    password = forms.CharField(label="Password", max_length=100)

class SignUpForm(forms.Form):
    user = forms.CharField(label="Username")
    password = forms.CharField(label="Password", max_length=100)
    email = forms.EmailField(label = "Email", max_length= 100)



