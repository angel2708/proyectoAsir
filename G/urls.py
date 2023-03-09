"""G URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf.urls import handler404

from django.conf import settings
from django.conf.urls.static import static

# VIEWS

from dashboard.views import vgeneral
from dashboard.views import vusers
from dashboard.views import vcalendar
from dashboard.views import vcompanies

urlpatterns = [
    # APPS IN DEVELOPEMENT
    path('', vgeneral.dashboard, name="inicio"),
    path('inicio/', vgeneral.dashboard, name="inicio"),
    path('email/', vgeneral.email, name="email"),
    path('chat/', vgeneral.chat, name="chat"),

    # SESSION CONTROL
    path('register/', vusers.register, name="register"),
    path('login/', vusers.login, name="login"),
    path('logout', vusers.logout, name="logout"),
    path('user-verification/<str:key>', vusers.verifyUser, name="verify-user"),
    path('user-invitation/<str:key>', vusers.acceptUserInvitation, name="user-invitation"),
    path('register-success/', vusers.registerSuccess, name="register-success"),
    path('invitations-management/', vusers.invitations, name="invitations-management"),

    # COMPANIES MANAGEMENT 
    path('companies-management/', vcompanies.companiesManagement, name="companies-management"),
    path('company-settings/', vcompanies.companySettings, name="company-settings"),
    path('switch-company/', vcompanies.switchCompany, name="switch-company"),

    #ADMINISTRACION USUARIOS
    path('users-management/', vusers.usersManagement, name="users-management"),
    path('users-management/<str:user_id>', vusers.userEdition, name="userEdition"),
    path('select-departament/', vusers.getDepartament, name="getDepartament"),

    #ADMINISTRACION DEPARTAMENTOS
    path('departaments-management/', vusers.departamentsManagement, name="departaments-management"),

    #CALENDARIO
    path('save-event/', vcalendar.saveEvent, name="saveEvent"),
    path('save-holidays/', vcalendar.saveHolidays, name="saveholidays"),
    path('save-task/', vcalendar.saveTask, name="saveTask"),
    path('save-reminder/', vcalendar.saveReminder, name="saveReminder"),
    path('get-company/', vcalendar.getCompany, name="getCompany"),
    path('get-vacations/', vusers.getVacations, name="getVacations"),

    # VACATIONS MANAGEMENT
    path('vacations-management/', vcalendar.vacations, name="vacations-management"),
    path('accept-pending-vacations/', vcalendar.acceptPendingVacations, name="acceptPendingVacations"),
    path('delete-pending-vacations/', vcalendar.deletePendingVacations, name="deletePendingVacations"),
    path('delete-accepted-vacations/', vcalendar.deleteAcceptedVacations, name="deleteAcceptedVacations"),
    path('get-editing-vacations/', vcalendar.getEditingVacations, name="getEditingVacations"),
    path('edit-vacations/', vcalendar.editVacations, name="editVacations"),
    path('show-vacations/', vcalendar.showVacations, name="showVacations"),
    path('get-avatars/', vcalendar.getAvatars, name="getAvatars"),

    # FICHAJE DE USUARIOS
    path('check-in/', vusers.checkIn, name="check-in"),
    path('check-in-control/<str:user_id>/<str:year>/<str:month>', vusers.checkInSpecific, name="check-in-specific"),
    path('check-in-control/', vusers.checkInControl, name="check-in-control"),
    path('check-data/', vgeneral.checkData, name="check-data"),

    #CONSULTAS ADMINISTRACION DE USUARIOS
    path('get-profile/', vusers.consultProfile, name="consultProfile"),
    path('get-user/', vusers.consultAccount, name="consultUser"),
    path('get-profiles/', vusers.consultProfiles, name="consultProfiles"),
    path('get-departament/', vusers.consultDepartament, name="consultDepartament"),
    path('get-agents/', vgeneral.get_agents, name="get-agents"),

    # USERS MANAGEMENT
    path('get-departament-users/', vusers.getDepartamentUsers, name="get-departament-users"),

    # URL´s en mantenimiento 
    path('mantenimiento/', vgeneral.mantenimiento, name="mantenimiento"),
    
    #NOTIFICATIONS
    path('get-scheduled-calls/', vusers.scheduledCalls, name="get-scheduled-calls"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'dashboard.views.vgeneral.error_404'
