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
from dashboard.views import vincidencias
from dashboard.views import vusers
from dashboard.views import vcalendar

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

    # DATABASE QUERIES
    #ADMINISTRACION USUARIOS
    path('users-management/', vusers.usersManagement, name="users-management"),
    path('users-management/<str:user_id>', vusers.userEdition, name="userEdition"),
    path('select-departament/', vusers.getDepartament, name="getDepartament"),

    #ADMINISTRACION DEPARTAMENTOS
    path('departaments-management/', vusers.departamentsManagement, name="departaments-management"),

    #CALENDARIO
    path('get-company/', vcalendar.getCompany, name="getCompany"),
    path('get-vacations/', vusers.getVacations, name="getVacations"),

    # VACATIONS MANAGEMENT
    path('vacations-management/', vcalendar.vacations, name="vacations-management"),
    path('show-vacations/', vcalendar.showVacations, name="showVacations"),
    path('get-avatars/', vcalendar.getAvatars, name="getAvatars"),

    # FICHAJE DE USUARIOS
    path('check-in/', vusers.checkIn, name="check-in"),
    path('check-in-control/<str:user_id>/<str:year>/<str:month>', vusers.checkInSpecific, name="check-in-specific"),
    path('check-in-control/', vusers.checkInControl, name="check-in-control"),
    path('check-data/', vgeneral.checkData, name="check-data"),
    path('export-csv/<str:year>/<str:month>', vusers.export_csv, name="export_csv"),
    path('export-csv/<str:year>/<str:month>/<str:dept>', vusers.export_csv_dept, name="export_csv_dept"),

    #CONSULTAS ADMINISTRACION DE USUARIOS
    # path('get-profile/', vusers.consultProfile, name="consultProfile"),
    path('get-user/', vusers.consultAccount, name="consultUser"),
    # path('get-profiles/', vusers.consultProfiles, name="consultProfiles"),
    path('get-departament/', vusers.consultDepartament, name="consultDepartament"),
    path('get-agents/', vgeneral.get_agents, name="get-agents"),

    # USERS MANAGEMENT
    path('get-departament-users/', vusers.getDepartamentUsers, name="get-departament-users"),

    # DDBB INCIDENCIAS
    path('incidences-management/', vincidencias.incidencias, name="incidences-management"),
    path('incidencias/', vincidencias.incidencias , name="incidencias"),
    path('save-incidence/', vincidencias.saveIncidence, name="saveIncidence"),
    path('get-incidence/', vincidencias.getIncidences, name="getIncidences"),
    path('get-dates/', vincidencias.getDates, name="getDates"),
    path('get-images/', vincidencias.getImages, name="getImages"),
    path('delete-incidence/', vincidencias.deleteIncidence, name="deleteIncidence"),
    path('check-incidence/', vincidencias.checkIncidence, name="checkIncidence"),
    path('uncheck-incidence/', vincidencias.uncheckIncidence, name="uncheckIncidence"),
    path('update-incidence/', vincidencias.updateIncidence, name="updateIncidence"),
    path('get-commentaries/', vincidencias.getCommentaries, name="getCommentaries"),
    path('save-comment/', vincidencias.saveComment, name="saveComment"),
    path('get-manager/', vincidencias.getManager, name="getManager"),

    # DJANGO ADMIN DOCUMENTATION GENERATOR
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    
    # DJANGO ADMIN DEFAULT
    path('admin/', admin.site.urls),

    # DDBB NUMBER INVOICE CUSTOMER REPORTS

    # URL´s en mantenimiento 
    path('mantenimiento/', vgeneral.mantenimiento, name="mantenimiento"),
    # URL´s proximamente 
    
    # DDBB PRODUCT MANAGEMENT
    path('incidences-management/', vincidencias.incidencias, name="incidences-management"),

    # WAREHOUSE 
    path('test-rxjs',vgeneral.pruebas,name='testing'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'dashboard.views.vgeneral.error_404'
