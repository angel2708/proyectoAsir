from django import forms
from django.core import validators

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.forms import ModelForm
from dashboard.models import Companies

class RegisterForm(UserCreationForm):
    class Meta:
        model=User
        fields = ['username', 'email', 'first_name', 'password1', 'password2']


class companyLogo(ModelForm):
    class Meta:
        model = Companies
        fields = ['logo']