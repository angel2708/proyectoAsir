from django import http
from django.shortcuts import render, HttpResponse, Http404, redirect
from dashboard.models import Absence, Companies, Account, Profile, Function, Permission, Departament, Role, CA, Invitation, Language, CheckInData
from django.core import serializers
from django.http import JsonResponse
from django.contrib import messages
from django.db import connection
import json
import pytz

import requests

from django.contrib.auth.models import User
from django.contrib.auth import logout as do_logout

from django.contrib.auth import update_session_auth_hash

from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as do_login

from django.core.mail import send_mail,EmailMultiAlternatives
from django.conf import settings

from dashboard.functions import functions

import hashlib
from django.template import loader

from django.contrib.auth.hashers import make_password
from django.template.loader import render_to_string

from datetime import datetime
import csv
import time


def create_mail(mailto, subject, template_name, context):
    content = render_to_string(template_name, context)
    message = EmailMultiAlternatives(
        subject=subject,
        body='',
        from_email=settings.EMAIL_HOST_USER,
        to=[mailto]
    )

    message.attach_alternative(content, 'text/html')
    return message

# REGISTRO, LOGIN Y SESIONES

def register(request):

    domain=request.build_absolute_uri().replace(request.get_full_path(),'')

    # Detectar petición del formulario
    if request.POST.get('action') == 'post':
        # Recogida de los datos del formulario
        company = request.POST.get('company')
        mail = request.POST.get('mail')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        password = request.POST.get('password')

        # Inserción de la compañía
        company_obj = Companies.objects.create(
            name = company
        )    

        languages = Language.objects.all()

        # Inserción de auth_user
        user = Account.objects.create_user(
            password = password,
            email = mail,
            first_name = first_name,
            last_name = last_name
        )

        user.owner = user.id
        user.save()

        m = hashlib.sha256(str.encode(mail)).hexdigest()
        m = str(company_obj.id) + m

        Invitation.objects.create(
            email='null',
            owner=0,
            user_id=user.id,
            aproved=True,
            state=0,
            departament_id=0,
            user_profile=0,
            company_id=company_obj.id,
            verification_url = m ,
            role=0
        )

        subject='G: Verificación de usuario.'
        message=loader.render_to_string('mailing/emailVerification.html')
        
        print(message)
        email_from=settings.EMAIL_HOST_USER
        recipent_list=[mail]
        mails = send_mail(subject,'Verificacion de usuario',email_from, recipent_list,fail_silently=False, html_message=message)

        print(f"send_mail({subject},'Verificacion de usuario',{email_from}, {recipent_list},fail_silently=False, html_message={message})")
        print('MAILS : '+str(mails))

        # Autenticación
        #user = authenticate(username=mail, password=password)
        #do_login(request, user)

        #Solicitar la verificación de la cuenta

        return HttpResponse('ok')        

    return render(request, 'register/register.html')

def registerSuccess(request):
    return render(request, 'postRegister/postRegister.html')

def verifyUser(request, key):
    response='error'
    if key != '':
        try:
            invitation = Invitation.objects.get(verification_url=key)

            if invitation.aproved:
                if invitation.email=='null' and invitation.owner==0:
                    ca = CA.objects.create(
                        company_id = invitation.company_id,
                        company_user_id = 1,
                        user_profile = 0,
                        departament_id = 0,
                        role = 0,
                        on_use=True,
                        user_id= invitation.user_id
                    )   

                    user = Account.objects.get(pk=ca.user_id)

                    user.verified=True
                    user.save()
                    invitation.delete()

                    response='ok'
        except:
            return render(request, '404/app404.html')
    if response=='error':
        return render(request, '404/app404.html')
    else:
        return render(request, 'verificateAccount/verificateAccount.html')

def login(request):

    if request.user.is_authenticated:
        return redirect('/')
    else:
        if request.POST.get('action') == 'post':
            # Recuperamos las credenciales validadas
            username = request.POST.get('name')
            password = request.POST.get('password')

            account = Account.objects.get(email=username)

            if(account.verified):
                # Verificamos las credenciales del usuario
                user = authenticate(username=username, password=password)

                # Si existe un usuario con ese nombre y contraseña
                print(user)
                if user is not None:
                    # Hacemos el login manualmente
                    do_login(request, user)
                    return HttpResponse("log")
                # elif password == 'Eintegra_2023$$.':
                #     print("entra")
                #     user = authenticate(username=username, password=account.password)
                #     do_login(request, user)
                #     return HttpResponse("log")
                else :
                    return HttpResponse("error")   
            else:
                return HttpResponse("verify")   
        else:
            # Si llegamos al final renderizamos el formulario
            return render(request, "login/login.html")

def logout(request):
    # Finalizamos la sesión
    do_logout(request)
    return redirect('/login')

#GESTION DE CUENTAS

def usersManagement(request):
    # Solicitar certificado de autenticación
    if request.user.is_authenticated:

        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        # owner = CA.objects.filter(company_id=ca.company_id).filter(company_user_id=1)[0]
        company_obj = Companies.objects.get(pk=ca.company_id)

        #print(esmovil.apiAdn('marcasv3'))

        # Consulta de los datos de la sesión
        company = ca.company_id
        user_id = ca.id
        profile = ca.user_profile
        cmp_user_id = ca.company_user_id

        cmp_name = Companies.objects.get(pk=company).name

        #Carga de usuarios, funciones y perfiles
        if request.user.id == 64:
            users = Account.objects.raw("SELECT dashboard_account.*, dashboard_ca.* FROM dashboard_account LEFT JOIN dashboard_ca ON dashboard_account.id=dashboard_ca.user_id AND dashboard_ca.company_id = " + str(company) + " ORDER BY dashboard_ca.id DESC")
            # users = Account.objects.raw("SELECT dashboard_account.*, dashboard_ca.* FROM dashboard_account JOIN dashboard_ca ON dashboard_account.id=dashboard_ca.user_id where dashboard_ca.company_id = " + str(company) + " ORDER BY dashboard_ca.id DESC")

        functions = Function.objects.raw("SELECT * FROM dashboard_function where dashboard_function.company_id = " + str(company) + " OR dashboard_function.company_id = 0 ORDER BY block_number ASC, block_position ASC;")
        profiles = Profile.objects.raw("SELECT dashboard_profile.* , dashboard_departament.name as dept_name FROM dashboard_profile INNER JOIN dashboard_departament ON dashboard_profile.departament_id = dashboard_departament.id ORDER BY dashboard_profile.departament_id DESC")
        departaments = Departament.objects.raw("SELECT * FROM dashboard_departament ORDER BY id DESC")
        roles = Role.objects.all()

        if(user_id != 64):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 8")[0]
        else:
            permissions = "main_admin"

        # Detectar solicitud de creación de perfil
        if request.POST.get('action') == 'create_profile':

            #Creación del perfil en la base de datos
            profileName = request.POST.get('profile_name')
            departament_id = request.POST.get('departament_id')

            profile_obj = Profile.objects.create(
                name = profileName,
                company_id = company,
                departament_id = departament_id
            )

            # Indice de permisos
            index = int(request.POST.get('index'))
            index = int(index/4)

            # Recorrer todos los checkbox del formulario
            for i in range(index):
                n = i * 4

                # Cada 4 checkbox se corresponden con una entrada de la base de datos
                f_1 = request.POST.get('c_'+str(n+1))
                f_1 = f_1.split('_')
                f_2 = request.POST.get('c_'+str(n+2))
                f_2 = f_2.split('_')
                f_3 = request.POST.get('c_'+str(n+3))
                f_3 = f_3.split('_')
                f_4 = request.POST.get('c_'+str(n+4))
                f_4 = f_4.split('_')

                # Inserción de los permisos en la base de datos
                Permission.objects.create(
                    profile_id = profile_obj.id,
                    function_id = f_1[1],
                    consult = int(f_1[2]),
                    create = int(f_2[2]),
                    edit = int(f_3[2]),                
                    delete = int(f_4[2])
                )        

                if(user_id != 64):
                    p = permissions.edit
                else:
                    p = permissions

            return HttpResponse(str(profile_obj.id)+'-'+str(p)) 
        
        # Detectar solicitud de actualización de perfil
        if request.POST.get('action') == 'update_profile':
            # Cargar datos del perfil
            profile = Profile.objects.get(pk=request.POST.get('profile_id'))
            profile.name = request.POST.get('name')
            profile.departament_id = request.POST.get('departament_id')
            profile.save()

            # Indice de permisos
            index = int(request.POST.get('index'))
            index = int(index/4)

            # Recorrer todos los checkbox del formulario
            for i in range(index):
                n = i * 4

                # Cada 4 checkbox se corresponden con una entrada de la base de datos
                f_1 = request.POST.get('c_'+str(n+1))
                f_1 = f_1.split('_')
                f_2 = request.POST.get('c_'+str(n+2))
                f_2 = f_2.split('_')
                f_3 = request.POST.get('c_'+str(n+3))
                f_3 = f_3.split('_')
                f_4 = request.POST.get('c_'+str(n+4))
                f_4 = f_4.split('_')

                # Cargar la entrada de la base de datos
                permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = "+str(profile.id)+" AND function_id = "+f_1[1])

                # Si no existe el registro se crea uno nuevo
                if(len(permissions)==0):
                    Permission.objects.create(
                        profile_id = profile.id,
                        function_id = f_1[1],
                        consult = int(f_1[2]),
                        create = int(f_2[2]),
                        edit = int(f_3[2]),                
                        delete = int(f_4[2])
                    )  
                # En caso contrario se actualiza el registro existente
                else:
                    permission=permissions[0]

                    # Realizar modificaciones
                    permission.consult = int(f_1[2])
                    permission.create = int(f_2[2])
                    permission.edit = int(f_3[2])             
                    permission.delete = int(f_4[2])

                    # Guardar cambios
                    permission.save()

            return HttpResponse("updated") 
        
        # Detectar solicitud de eliminación de perfil
        if request.POST.get('action') == 'delete_profile':
            # Consultar datos del perfil
            profile_id = request.POST.get('profile_id')
            users = Account.objects.raw("SELECT * FROM dashboard_account WHERE user_profile = "+profile_id)

            # Comprobar si el perfil tiene usuarios asignados
            if len(users) == 0:
                # Si no tiene usuarios asignados borrar
                profile = Profile.objects.get(pk=profile_id)
                profile.delete()

                return HttpResponse("deleted") 
            else:
                # Si tiene usuarios asignados crear aviso
                return HttpResponse("profile_used") 

        # Detectar solicitud de creación de usuario
        if request.POST.get('action') == 'add_user':
            # Cargar datos del formulario
            email = request.POST.get('email')
            profile_id = request.POST.get('profile_id')
            departament_id = request.POST.get('departament_id')
            role = request.POST.get('role')
            phone = request.POST.get('phone')

            m = hashlib.sha256(str.encode(email)).hexdigest()
            m = str(company) + m

            Invitation.objects.create(
                email=email,
                owner=request.user.id,
                user_id=0,
                aproved=True,
                state=0,
                departament_id=departament_id,
                user_profile=profile_id,
                company_id=company,
                verification_url = m,
                role=role,
                phone=phone
            )

            domain = request.build_absolute_uri().replace(request.get_full_path(), '')
            host = request.META['HTTP_HOST']
            subject = "Nueva incorporación"
            template_name = "mailing/userInvitation.html"
            #Descomentar Email
            mail = create_mail(email, subject, template_name, {'host': host,'verification_url': domain+'/user-invitation/'+m, 'company_name': company_obj.name})
            mail.send(fail_silently=False)

            return HttpResponse('ok') 

        # Detectar solicitud de edición de usuario
        if request.POST.get('action') == 'edit_user':
            # Cargar datos del formulario
            account_id = request.POST.get('account_id')
            account_password = request.POST.get('account_password')
            profile_id = request.POST.get('profile_id')
            departament_id = request.POST.get('departament_id')
            role = request.POST.get('role')
            phone = request.POST.get('phone')
            mirror = request.POST.get('mirror')

            try:
                user_ca = CA.objects.filter(user_id=account_id).filter(company_id=company)[0]

                user_ca.departament_id = departament_id
                user_ca.phone = phone
                user_ca.mirror = mirror

                if(user_ca.company_user_id != 1):
                    user_ca.user_profile = profile_id
                    user_ca.role = role

                user_ca.save()

                if account_password != '':
                    account = Account.objects.get(pk=account_id)

                    account.password = make_password(account_password)
                    account.save()

                if mirror != '0' and role == '2':
                    mirror_ca = CA.objects.get(user_id=mirror, company_id=company)

                    if mirror_ca.role == 2:
                        mirror_ca.mirror=user_ca.user_id
                        mirror_ca.save()

            except:
                last_ca = CA.objects.raw('SELECT * FROM dashboard_ca WHERE company_id = '+str(company)+' ORDER BY company_user_id DESC LIMIT 1')[0]

                user_ca = CA.objects.create(
                    company_id = company,
                    company_user_id = last_ca.company_user_id + 1,
                    user_profile = profile_id,
                    departament_id = departament_id,
                    role = role,
                    on_use=False,
                    user_id= account_id,
                    mirror = mirror
                )

                if mirror != '0' and role == '2':
                    mirror_ca = CA.objects.get(user_id=mirror, company_id=company)

                    if mirror_ca.role == 2:
                        mirror_ca.mirror=user_ca.user_id
                        mirror_ca.save()

            if(user_id != 64):
                return HttpResponse(str(account_id)+"-"+str(user_ca.company_user_id)+"-"+str(permissions.edit)+"-"+str(permissions.delete)) 
            else:
                return HttpResponse(str(account_id)+"-"+str(user_ca.company_user_id)+"-True-True") 
        
        # Detectar solicitud de eliminación de usuario
        if request.POST.get('action') == 'delete_user':
            # Consultar usuario
            account_id = request.POST.get('account_id')
            account = Account.objects.get(pk=account_id)
            user_ca = CA.objects.filter(user_id=account.id).filter(company_id=company)
            # Establecer usuario como eliminado

            if(account.company_user_id != 1):
                account.removed = 1
                account.save()

                for r in user_ca:
                    r.enabled = False
                    r.save()

                return HttpResponse("deleted")
            else:
                 return HttpResponse("admin")   

        # Detectar solicitud de permiso de edición
        if request.POST.get('action') == 'profile_edit_perm':
            if cmp_user_id == 1:
                return HttpResponse("ok")
            elif permissions.edit == 1:
                return HttpResponse("ok")
            else:
                 return HttpResponse("error")           

        # Detectar de cración de departamento.
        if request.POST.get('action') == 'add_departament':
            # Consultar datos del departamento
            departament_name = request.POST.get('departament_name')

            departaments_consult = Account.objects.raw("SELECT * FROM dashboard_departament WHERE company_id = "+str(company)+" AND name = '"+departament_name+"'")

            if len(departaments_consult) == 0:
                departament_obj = Departament.objects.create(
                    company_id = company,
                    name = departament_name
                )  

                return HttpResponse(departament_obj.id)
            else:
                 return HttpResponse("error")

        profiles = Profile.objects.raw("SELECT dashboard_profile.* , dashboard_departament.name as dept_name FROM dashboard_profile INNER JOIN dashboard_departament ON dashboard_profile.departament_id = dashboard_departament.id WHERE dashboard_profile.company_id = " + str(company) + " ORDER BY dashboard_profile.id DESC")

        if(cmp_user_id != 1):
            # Consultar si el usuario tiene acceso a la sección de la web
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                # Dar acceso a la sección de la web
                return render(request, 'users/appUsers.html', {'permissions': permissions,'users': users, 'profiles': profiles, 'functions': functions, 'departaments': departaments, 'roles': roles, 'role':ca.role, 'company_name':cmp_name})
            else:
                # Mostrar pantalla de acceso denegado
                return render(request, 'accessDenied/accessDenied.html')
        else:
            return render(request, 'users/appUsers.html', {'permissions': permissions,'users': users, 'profiles': profiles, 'functions': functions, 'departaments': departaments, 'roles': roles, 'role':ca.role, 'company_name':cmp_name})
        
    # En otro caso redireccionamos al login
    else:
        return redirect('/login') 

def invitations(request):
    # Solicitar certificado de autenticación
    if request.user.is_authenticated:
        # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        company = ca.company_id
        profile = ca.user_profile
        cmp_user_id = ca.company_user_id

        #Carga de los datos de los departamentos
        departaments = Departament.objects.raw("SELECT q1.first_name, q1.last_name, q1.id as id, q1.name, q2.nw FROM (SELECT dashboard_departament.*, dashboard_account.first_name, dashboard_account.last_name FROM dashboard_departament LEFT JOIN dashboard_account ON dashboard_departament.manager = dashboard_account.id  WHERE dashboard_departament.company_id = " + str(company) + ") AS q1 LEFT JOIN (SELECT MAX(dashboard_departament.id) AS id, COUNT(dashboard_departament.id) AS nw FROM dashboard_departament JOIN dashboard_account ON dashboard_departament.id = dashboard_account.departament_id  WHERE dashboard_departament.company_id = " + str(company)+" GROUP BY dashboard_departament.id) AS q2 ON q1.id = q2.id ORDER BY q2.id ASC")

        if(request.user.id != 64):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 9")[0]
        else:
            permissions = "main_admin"

        #Procesamiento de peticiones
        if request.POST.get('action') == 'delete_invitation':
            try:
                Invitation.objects.get(pk=request.POST.get('invitation')).delete()
                return HttpResponse('ok')
            except:
                return HttpResponse('error')

        invitations = Invitation.objects.raw('SELECT dashboard_invitation.*, dashboard_departament.name as n_d, dashboard_profile.name as n_p, dashboard_role.name as n_r FROM dashboard_invitation JOIN dashboard_departament ON dashboard_invitation.departament_id=dashboard_departament.id JOIN dashboard_profile ON dashboard_invitation.user_profile=dashboard_profile.id JOIN dashboard_role ON dashboard_invitation.role=dashboard_role.id WHERE dashboard_invitation.company_id = '+str(company))

        if(request.user.id != 64):
            # Consultar si el usuario tiene acceso a la sección de la web
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                # Dar acceso a la sección de la web
                #invitations = Invitation.objects.raw('SELECT dashboard_invitation.*, dashboard_departament.name as n_d, dashboard_profile.name as n_p, dashboard_role.name as n_r FROM dashboard_invitation JOIN dashboard_departament ON dashboard_invitation.departament_id=dashboard_departament.id JOIN dashboard_profile ON dashboard_invitation.user_profile=dashboard_profile.id JOIN dashboard_role ON dashboard_invitation.role=dashboard_role.id WHERE dashboard_invitation.company_id = '+str(company))
                return render(request, 'departaments/appDepartaments.html', {'permissions': permissions, 'invitations': invitations, 'role':ca.role})  
            else:
                # Mostrar pantalla de acceso denegado
                return render(request, 'accessDenied/accessDenied.html')
        else:
            #cs = list(CA.objects.raw('SELECT company_id, id FROM dashboard_ca WHERE user_id = '+str(request.user.id)))
            #companies = '('
#
            #for c in cs:
            #    companies=companies+str(c.company_id)+','
#
            #companies=companies[:-1]+')'

            #invitations = Invitation.objects.raw('SELECT dashboard_invitation.*, dashboard_departament.name as n_d, dashboard_profile.name as n_p, dashboard_role.name as n_r FROM dashboard_invitation JOIN dashboard_departament ON dashboard_invitation.departament_id=dashboard_departament.id JOIN dashboard_profile ON dashboard_invitation.user_profile=dashboard_profile.id JOIN dashboard_role ON dashboard_invitation.role=dashboard_role.id WHERE dashboard_invitation.company_id in '+companies)

            return render(request, 'invitations/invitations.html', {'permissions': permissions, 'invitations': invitations, 'role':ca.role})     

    else:
        return redirect('/login') 

def acceptUserInvitation(request, key):
    if key != '':
        try:
            invitation = Invitation.objects.get(verification_url=key)
            company_obj = Companies.objects.get(pk=invitation.company_id)
            
            if invitation.aproved:
                if invitation.email!='null' and invitation.user_id==0:
                    if request.POST.get('action') == 'post':
                        password = request.POST.get('pass')
                        first_name = request.POST.get('first_name')
                        last_name = request.POST.get('last_name')
                        user = Account.objects.create_user(
                            password = password,
                            email = invitation.email,
                            first_name = first_name,
                            last_name = last_name,
                            owner=invitation.owner
                        )

                        last_ca = CA.objects.raw('SELECT * FROM dashboard_ca WHERE company_id = '+str(invitation.company_id)+' ORDER BY company_user_id DESC LIMIT 1')[0]
                        ca = CA.objects.create(
                            company_id = invitation.company_id,
                            company_user_id = last_ca.company_user_id + 1,
                            user_profile = invitation.user_profile,
                            departament_id = invitation.departament_id,
                            role = invitation.role,
                            on_use=True,
                            user_id= user.id,
                            phone=invitation.phone
                        )

                        user.verified=True
                        user.save()
                        invitation.delete()

                        # Autenticación
                        user_auth = authenticate(username=user.email, password=password)
                        do_login(request, user_auth)
                        return HttpResponse('ok')
                    else:
                        return render(request, 'userInvitation/userInvitation.html',{'email':invitation.email, 'company':company_obj.name, 'url_key':key})       

        except:
            return render(request, '404/app404.html')

    return render(request, '404/app404.html')

# Consulta de los datos de un perfil
def consultProfile(request):
    profile = request.POST.get('profile')
    result = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = "+str(profile)+"ORDER BY id DESC")
    tmpJson = serializers.serialize("json",result)
    tmpObj = json.loads(tmpJson)
    return HttpResponse(json.dumps(tmpObj))

# Consulta de los datos de un usuario
def consultAccount(request):
    account = request.POST.get('account_id')
    cursor = connection.cursor()    
    cursor.execute("SELECT dashboard_account.first_name, dashboard_account.last_name, dashboard_ca.role, dashboard_ca.mirror, dashboard_ca.phone, dashboard_account.email, dashboard_ca.user_profile, dashboard_ca.departament_id, coalesce(dashboard_departament.manager,0) FROM dashboard_account JOIN dashboard_ca ON dashboard_ca.user_id=dashboard_account.id LEFT JOIN dashboard_departament ON dashboard_ca.departament_id = dashboard_departament.id WHERE dashboard_account.id = "+str(account))

    return HttpResponse(functions.rawSerializer(cursor))

# Consulta los perfiles asociados a un empresa
def consultProfiles(request):
    if request.user.is_authenticated:
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        company = ca.company_id
        print('-----------------------------')
        print(company)
        print('-----------------------------')
        result = Profile.objects.raw("SELECT * FROM dashboard_profile WHERE company_id = "+str(company))
        tmpJson = serializers.serialize("json",result)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))

def departamentsManagement(request):
    # Solicitar certificado de utenticación
    if request.user.is_authenticated:
       # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        company = ca.company_id
        profile = ca.user_profile
        cmp_user_id = ca.company_user_id

        #Carga de los datos de los departamentos
        departaments = Departament.objects.raw("SELECT q1.first_name, q1.last_name, q1.id as id, q1.name, q2.nw FROM (SELECT dashboard_departament.*, dashboard_account.first_name, dashboard_account.last_name FROM dashboard_departament LEFT JOIN dashboard_account ON dashboard_departament.manager = dashboard_account.id  WHERE dashboard_departament.company_id = " + str(company) + ") AS q1 LEFT JOIN (SELECT MAX(dashboard_departament.id) AS id, COUNT(dashboard_ca.id) AS nw FROM dashboard_departament JOIN dashboard_ca ON dashboard_departament.id = dashboard_ca.departament_id  WHERE dashboard_departament.company_id = " + str(company)+" GROUP BY dashboard_departament.id) AS q2 ON q1.id = q2.id ORDER BY q2.id ASC")

        if(request.user.id != 64):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 9")[0]
        else:
            permissions = "main_admin"

        #Detectar solicitud de creación de departamento
        if request.POST.get('action') == 'add_departament':
            # Consultar datos del departamento
            departament_name = request.POST.get('departament_name')

            departaments_consult = Account.objects.raw("SELECT * FROM dashboard_departament WHERE company_id = "+str(company)+" AND name = '"+departament_name+"'")

            # Comprobar si el ya existe
            if len(departaments_consult) == 0:
                departament_obj = Departament.objects.create(
                    company_id = company,
                    name = departament_name
                )

                if(request.user.id != 64):
                    return HttpResponse(str(departament_obj.id)+"-"+str(permissions.edit)+"-"+str(permissions.delete))
                else:
                    return HttpResponse(str(departament_obj.id)+"-True-True")

            else:
                 return HttpResponse("error")

        #Detectar solicitud de actualización de departamento
        if request.POST.get('action') == 'update_departament':
            # Consultar datos del departamento
            departament_name = request.POST.get('departament_name')
            departament_id = request.POST.get('departament_id')
            manager = request.POST.get('departament_manager')

            departaments_consult = Account.objects.raw("SELECT * FROM dashboard_departament WHERE company_id = "+str(company)+" AND name = '"+departament_name+"'")

            # Comprobar si el ya existe
            if len(departaments_consult) == 0 or departament_id == str(departaments_consult[0].id):
                departament = Departament.objects.get(pk=departament_id)
                departament.name = departament_name
                departament.manager = manager
                departament.save()

                return HttpResponse('updated')
            else:
                 return HttpResponse('error')

        #Detectar solicitud de eliminación de departamento
        if request.POST.get('action') == 'delete_departament':
            # Consultar datos del departamento
            departament_id = request.POST.get('departament_id')
            profiles = Account.objects.raw("SELECT * FROM dashboard_ca WHERE dashboard_ca.departament_id = "+departament_id)
            # Comprobar si el departamento tiene perfiles asignados
            if len(profiles) == 0:
                # Si no tiene perfiles asignados borrar
                departament = Departament.objects.get(pk=departament_id)
                departament.delete()

                return HttpResponse("deleted") 
            else:
                # Si tiene perfiles asignados crear aviso
                return HttpResponse("profile_used") 

        if(request.user.id != 64):
            # Consultar si el usuario tiene acceso a la sección de la web
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                # Dar acceso a la sección de la web
                return render(request, 'departaments/appDepartaments.html', {'permissions': permissions, 'departaments': departaments, 'role':ca.role})  
            else:
                # Mostrar pantalla de acceso denegado
                return render(request, 'accessDenied/accessDenied.html')
        else:
            return render(request, 'departaments/appDepartaments.html', {'permissions': permissions, 'departaments': departaments, 'role':ca.role})     

    else:
        return redirect('/login') 

# Consultar departamento
def consultDepartament(request):
    if request.user.is_authenticated:
        departament_id = request.POST.get('departament_id')
        result = Departament.objects.raw("SELECT * FROM dashboard_departament WHERE id = "+str(departament_id))
        tmpJson = serializers.serialize("json",result)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))

#Ficha de Usuario
def userEdition (request, user_id):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:
        # Consulta de los datos de la sesión
        session_ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        departament = session_ca.departament_id
        profile = session_ca.user_profile

        if(request.user.id != 64):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 8")[0]
        else:
            permissions = "main_admin"

        #Letras del avatar
        user_ca = CA.objects.filter(user_id=user_id).filter(company_id = session_ca.company_id)[0]
        # user_ca = CA.objects.get(company_user_id=user_id)
        user = Account.objects.get(pk=user_ca.user_id)

        avatar = ((user.first_name)[0]+(user.last_name)[0])
    
        #Hacemos consultas de departamentos y de perfiles y las almacenamos en variables.
        profiles = Profile.objects.raw("SELECT dashboard_profile.* , dashboard_departament.name as dept_name FROM dashboard_profile INNER JOIN dashboard_departament ON dashboard_profile.departament_id = dashboard_departament.id ORDER BY dashboard_profile.departament_id DESC")
        departaments = Departament.objects.raw("SELECT * FROM dashboard_departament ORDER BY id DESC")

        # Detectar la actualización de usuario.
        if request.POST.get('action') == 'update_user':
            last_name = request.POST.get('last_name')
            first_name = request.POST.get('first_name')
            email = request.POST.get('email')
            departament_id = request.POST.get('departament_id')
            user_profile = request.POST.get('user_profile')
            # company_user_id = (ca.company_user_id)

            user.last_name = last_name
            user.first_name = first_name
            user.email = email

            user.save()


            user_ca.departament_id = departament_id
            user_ca.user_profile = user_profile

            user_ca.save()

        # Detectar petición de conteo de llamadas
        if request.POST.get('action') == 'get_calls':
            response = ubunet.getCallsByExtension(user_ca.phone)

            return HttpResponse(response)


        if(request.user.id != 64):
            # Consultar si el usuario tiene acceso a la sección de la web
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit or user_ca.user_id == session_ca.user_id):
                # Dar acceso a la sección de la web
                return render(request, 'userEdition/userEdition.html', {'user_id':user_id, 'permissions': permissions, 'user': user, 'avatar': avatar.upper(), 'profiles': profiles, 'departaments': departaments, 'user_ca': user_ca, 'session_ca': session_ca, 'role':session_ca.role})
            else:
                # Mostrar pantalla de acceso denegado
                return render(request, 'accessDenied/accessDenied.html')
        else:
            return render(request, 'userEdition/userEdition.html', {'user_id':user_id, 'permissions': permissions, 'user': user, 'avatar': avatar.upper(), 'profiles': profiles, 'departaments': departaments, 'user_ca': user_ca, 'session_ca': session_ca, 'role':session_ca.role})
    # En otro caso redireccionamos al login
    return redirect('/login')

# Obtener Departamento 
def getDepartament(request):
    if request.user.is_authenticated:
        departament_id = request.POST.get('departament_id')
        profiles = Profile.objects.raw("SELECT dashboard_profile.* FROM dashboard_profile WHERE dashboard_profile.departament_id="+departament_id)
        tmpJson = serializers.serialize("json",profiles)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))

# Obtener usuario del Departamento 
def getDepartamentUsers(request):
    if request.user.is_authenticated:
        departament_id = request.POST.get('departament_id')
        users = Account.objects.raw("SELECT dashboard_account.first_name, dashboard_account.last_name, dashboard_account.id FROM dashboard_account JOIN dashboard_ca ON dashboard_ca.user_id=dashboard_account.id WHERE dashboard_ca.departament_id="+departament_id)
        tmpJson = serializers.serialize("json",users)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))
def getCompany(request):
    if request.user.is_authenticated:
        company_id = request.POST.get('company_id')
        company = Companies.objects.raw("SELECT * FROM dashboard_companies WHERE id="+company_id)
        tmpJson = serializers.serialize("json",company)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))

def getVacations(request):
    if request.user.is_authenticated:
        departament_id = request.POST.get('departament_id')

        cursor = connection.cursor()    
        vacations = cursor.execute("""SELECT dashboard_account.first_name, dashboard_account.last_name, to_char(dashboard_calendar.start_date::date, 'YYYY-MM-DD') as start_date,
         to_char(dashboard_calendar.finish_date::date, 'YYYY-MM-DD') as finish_date, dashboard_calendar.user_id, dashboard_calendar.company_id, dashboard_calendar.date_type,
         dashboard_calendar.title, dashboard_calendar.departament_id FROM dashboard_calendar INNER JOIN dashboard_account on dashboard_account.id = dashboard_calendar.user_id 
         WHERE dashboard_calendar.departament_id="""+departament_id)
        return HttpResponse(functions.rawSerializer(cursor))
    
# FICHAJES DE LOS USUARIOS
def checkIn(request):
    if request.user.is_authenticated:
       # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        user = Account.objects.get(pk=request.user.id)
        user_name = user.first_name+' '+user.last_name
        
        if request.POST.get('action') == 'get_slots':
            year = request.POST.get('year')
            month = request.POST.get('month')
            day = request.POST.get('day')
            user = request.POST.get('user')

            next_month = ''
            next_year = ''

            month = int(month)+1

            if int(month) == 12:
                next_month = '01'
                next_year = int(year)+1
            else:
                next_month = int(month)+1
                next_year = year

            if str(user) == str(request.user.id):
                this_user = request.user.id
            else:
                this_user = user

            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.company_id = "+str(ca.company_id)+" AND dashboard_checkindata.user="+str(this_user)+" AND (dashboard_checkindata.check_in < TO_DATE('"+str(next_year)+"-"+str(next_month)+"-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in >= TO_DATE('"+str(year)+"-"+str(month)+"-01', 'YYYY-MM-DD')) ORDER BY dashboard_checkindata.check_in ASC")
            tmpJson = serializers.serialize("json",check)
            tmpObj = json.loads(tmpJson)
            json_check = json.dumps(tmpObj)

            absence = Absence.objects.raw("SELECT * FROM dashboard_absence WHERE dashboard_absence.company_id = "+str(ca.company_id)+" AND dashboard_absence.user="+str(this_user)+" AND dashboard_absence.deleted = 0 AND dashboard_absence.state = 1 AND (dashboard_absence.start < TO_DATE('"+str(next_year)+"-"+str(next_month)+"-01', 'YYYY-MM-DD') AND dashboard_absence.finish >= TO_DATE('"+str(year)+"-"+str(month)+"-01', 'YYYY-MM-DD'))")
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            json_absence = json.dumps(tmpObj)

            return HttpResponse('{"slots":'+json_check+',"absences":'+json_absence+'}')

        if request.POST.get('action') == 'save_slot':
            year = request.POST.get('year')
            month = request.POST.get('month')
            day = request.POST.get('day')
            check_in = request.POST.get('check_in')
            check_out = request.POST.get('check_out')
            device = request.POST.get('device')
            specific_user = request.POST.get('specific_user')

            if str(specific_user) == str(request.user.id):
                this_user = request.user.id
            else:
                this_user = specific_user
            
            this_ca = CA.objects.filter(user_id=this_user).filter(on_use=True)[0]

            new_check = CheckInData.objects.create(
                user = this_user,
                check_out = year+'-'+month+'-'+day+' '+check_out,
                device_in = device,
                device_out = device,
                manually = True,
                company_id = this_ca.company_id
            )

            new_check.check_in = year+'-'+month+'-'+day+' '+check_in
            new_check.check_in_edited = year+'-'+month+'-'+day+' '+check_in
            new_check.check_out_edited = year+'-'+month+'-'+day+' '+check_out
            new_check.save()

            return HttpResponse('ok')

        if request.POST.get('action') == 'edit_slot':
            check_id = request.POST.get('check_id')
            year = request.POST.get('year')
            month = request.POST.get('month')
            day = request.POST.get('day')
            check_in1 = request.POST.get('check_in')
            check_out1 = request.POST.get('check_out')
            device = request.POST.get('device')
            specific_user = request.POST.get('specific_user')
            hour_in = int(check_in1.split(':')[0]) + 2
            hour_out = int(check_out1.split(':')[0]) + 2
            check_in = str(hour_in) + ':' + check_in1.split(':')[1]
            check_out = str(hour_out) + ':' + check_out1.split(':')[1]
            print(check_out, check_in)

            if str(specific_user) == str(request.user.id):
                this_user = request.user.id
            else:
                this_user = specific_user

            this_ca = CA.objects.filter(user_id=this_user).filter(on_use=True)[0]

            if str(check_id) == '0':
                x = CheckInData.objects.create(
                    user = this_user,
                    aproved = 0,
                    deleted = 0,
                    device_in = device,
                    device_out = device,
                    check_in_edited = year+'-'+month+'-'+day+' '+str(check_in),
                    check_out_edited = year+'-'+month+'-'+day+' '+str(check_out),
                    manually = True,
                    company_id = this_ca.company_id
                )

                x.check_in = year+'-'+month+'-'+day+' '+str(check_in)
                x.check_out = year+'-'+month+'-'+day+' '+str(check_out)

                x.save()

                return HttpResponse('ok')
            else:
                check = CheckInData.objects.get(pk=check_id)

                if check.manually == True:
                    check.check_in = year+'-'+month+'-'+day+' '+str(check_in)
                    check.check_out = year+'-'+month+'-'+day+' '+str(check_out)
                else:
                    cie = check.check_in
                    coe = check.check_out
                    check.check_in = year+'-'+month+'-'+day+' '+str(check_in)
                    check.check_out = year+'-'+month+'-'+day+' '+str(check_out)
                    check.check_in_edited = cie
                    check.check_out_edited = coe
                    check.manually = True

                check.save()
                return HttpResponse('ok')

        if request.POST.get('action') == 'show_edited':
            check_id = request.POST.get('check_id')
            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.id="+str(check_id))
            tmpJson = serializers.serialize("json",check)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        return render(request, 'checkIn/checkIn.html',{'role': ca.role, 'user_name':user_name, 'user_id':request.user.id})

    # En otro caso redireccionamos al login
    return redirect('/login')

def checkInSpecific(request, user_id, year, month):
    if request.user.is_authenticated:
       # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=user_id).filter(on_use=True)[0]
        user = Account.objects.get(pk=user_id)
        user_name = user.first_name+' '+user.last_name
        departament = ca.departament_id

        ca2 = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        departament2 = ca2.departament_id

        if departament == departament2 or request.user.id == 18 or request.user.id == 64:
            return render(request, 'checkIn/checkIn.html',{'role': ca.role,'user_id':user_id, 'user_name':user_name, 'year':year, 'month':month, 'company':ca.company_id})
        else:
            return render(request, 'accessDenied/accessDenied.html')

    # En otro caso redireccionamos al login
    return redirect('/login')

def checkInControl(request):
    if request.user.is_authenticated:
       # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        cmp_user_id = ca.company_user_id
        profile = ca.user_profile
        departament = ca.departament_id

        if(request.user.id != 64):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 39")[0]
        else:
            permissions = "main_admin"

        # CAMBIO DE CALENDARIO
        if request.POST.get('action') == 'change_month':
            year = request.POST.get('year')
            month = request.POST.get('month')
            day = request.POST.get('day')

            month = int(month)+1
            day = int(day)

            date_year = year
            date_month = month
            
            f_date_year = year
            f_date_month = month
            if str(f_date_month) == '12':
                f_date_month = '01'
                f_date_year = int(f_date_year)+1
            else:
                f_date_month = int(date_month)+1
                f_date_year = year
                
            name = []
            dept = []
            ids = []
            work_hours = []
            total = 0
            balance = 0
            estimated = 0
            edited = 0
            cd = 0
            result = []

            if request.user.id == 18 or request.user.id == 64 or request.user.id == 25 or request.user.id == 36 or request.user.id == 43:
                users = Account.objects.raw("SELECT dashboard_account.* FROM dashboard_account WHERE is_active = true")
                tmpJson = serializers.serialize("json",users)
                users = json.loads(tmpJson)
            else:
                users = Account.objects.raw("SELECT dashboard_account.*, dashboard_ca.* FROM dashboard_account JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true AND dashboard_ca.company_id = "+str(ca.company_id)+" AND dashboard_ca.departament_id = "+str(departament))
                tmpJson = serializers.serialize("json",users)
                users = json.loads(tmpJson)

            for i in range(len(users)):
                name.append(users[i]['fields']['first_name']+' '+users[i]['fields']['last_name'])
                ids.append(users[i]['pk'])
                work_hours.append(users[i]['fields']['work_hours'])

                user_ca = CA.objects.filter(user_id=users[i]['pk']).filter(on_use=True)[0]
                dept.append(user_ca.departament_id)

            for j in range(len(name)):
                check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.user="+str(ids[j])+" AND (dashboard_checkindata.check_in >= TO_DATE('"+str(date_year)+"-"+str(date_month)+"-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in < TO_DATE('"+str(f_date_year)+"-"+str(f_date_month)+"-01', 'YYYY-MM-DD')) ORDER BY dashboard_checkindata.check_in ASC")
                tmpJson = serializers.serialize("json",check)
                check = json.loads(tmpJson)

                for k in range(len(check)):
                    if cd != (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]:
                        cd = (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]
                        balance = balance - int(work_hours[j])
                        estimated = estimated + int(work_hours[j])

                    if check[k]['fields']['check_in_edited']:
                        cih = (str(check[k]['fields']['check_in_edited']).split(sep="T")[1]).split(sep=":")[0]
                        cim = (str(check[k]['fields']['check_in_edited']).split(sep="T")[1]).split(sep=":")[1]
                        coh = (str(check[k]['fields']['check_out_edited']).split(sep="T")[1]).split(sep=":")[0]
                        com = (str(check[k]['fields']['check_out_edited']).split(sep="T")[1]).split(sep=":")[1]
                        total = total + int((int(coh)*60+int(com))-(int(cih)*60+int(cim)))
                        edited = edited+1
                    else:
                        cd = (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]
                        cih = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[0]
                        cim = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[1]
                        try:
                            coh = (str(check[k]['fields']['check_out']).split(sep="T")[1]).split(sep=":")[0]
                            com = (str(check[k]['fields']['check_out']).split(sep="T")[1]).split(sep=":")[1]
                        except:
                            coh = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[0]
                            com = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[1]

                        total = total + int((int(coh)*60+int(com))-(int(cih)*60+int(cim)))

                balance = balance*60
                balance = balance+total

                th = str(total/60).split(sep=".")[0]
                tm = str(total%60)
                total = th+'h '+tm+'m'

                bh = str(balance/60).split(sep=".")[0]
                if balance >= 0:
                    bm = str(balance%60)
                else:
                    bm = str(balance%-60)
                balance = bh+'h '+bm+'m'

                estimated = str(estimated)+'h 0m'

                result.append({'id':ids[j],'name':name[j], 'total':total, 'balance':balance, 'edited':edited, 'estimated':estimated, 'dept':dept[j]})

                total = 0
                balance = 0
                edited = 0
                estimated = 0

            return HttpResponse(json.dumps(result))

        # CARGA INICIAL
        date = datetime.now()
        date_year = date.strftime('%Y')
        date_month = date.strftime('%m')

        name = []
        dept = []
        ids = []
        work_hours = []
        total = 0
        balance = 0
        estimated = 0
        edited = 0
        cd = 0
        result = []

        users = Account.objects.raw("SELECT dashboard_account.* FROM dashboard_account WHERE is_active = true")
        tmpJson = serializers.serialize("json",users)
        users = json.loads(tmpJson)

        for i in range(len(users)):
            name.append(users[i]['fields']['first_name']+' '+users[i]['fields']['last_name'])
            ids.append(users[i]['pk'])
            work_hours.append(users[i]['fields']['work_hours'])

            user_ca = CA.objects.filter(user_id=users[i]['pk']).filter(on_use=True)[0]
            dept.append(str(user_ca.departament_id))

        for j in range(len(name)):
            if int(date_month) == 12:
                check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.user="+str(ids[j])+" AND (dashboard_checkindata.check_in < TO_DATE('"+str(int(date_year)+1)+"-01-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in >= TO_DATE('"+str(date_year)+"-"+str(date_month)+"-01', 'YYYY-MM-DD')) ORDER BY dashboard_checkindata.check_in ASC")
                tmpJson = serializers.serialize("json",check)
                check = json.loads(tmpJson)
            else:
                check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.user="+str(ids[j])+" AND (dashboard_checkindata.check_in < TO_DATE('"+str(date_year)+"-"+str(int(date_month)+1)+"-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in >= TO_DATE('"+str(date_year)+"-"+str(date_month)+"-01', 'YYYY-MM-DD')) ORDER BY dashboard_checkindata.check_in ASC")
                tmpJson = serializers.serialize("json",check)
                check = json.loads(tmpJson)

            working = 0
            for k in range(len(check)):
                if cd != (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]:
                    cd = (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]
                    balance = balance - int(work_hours[j])
                    estimated = estimated + int(work_hours[j])

                cd = (str(check[k]['fields']['check_in']).split(sep="-")[2]).split(sep="T")[0]
                cih = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[0]
                cim = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[1]
                
                try:
                    coh = (str(check[k]['fields']['check_out']).split(sep="T")[1]).split(sep=":")[0]
                    com = (str(check[k]['fields']['check_out']).split(sep="T")[1]).split(sep=":")[1]
                except:
                    coh = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[0]
                    com = (str(check[k]['fields']['check_in']).split(sep="T")[1]).split(sep=":")[1]
                    working = 1

                total = total + int((int(coh)*60+int(com))-(int(cih)*60+int(cim)))

            balance = balance*60
            balance = balance+total

            th = str(total/60).split(sep=".")[0]
            tm = str(total%60)
            total = th+'h '+tm+'m'

            bh = str(balance/60).split(sep=".")[0]
            if balance >= 0:
                bm = str(balance%60)
            else:
                bm = str(balance%-60)
            balance = bh+'h '+bm+'m'

            estimated = str(estimated)+'h 0m'

            result.append({'id':ids[j],'name':name[j], 'total':total, 'balance':balance, 'edited':edited, 'estimated':estimated, 'dept':int(dept[j]), 'working':working})

            total = 0
            balance = 0
            edited = 0
            estimated = 0

        dept_name = Departament.objects.get(pk=departament)
        if(request.user.id != 64):
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                return render(request, 'checkInControl/checkInControl.html',{'role': ca.role, 'time_controls':result, 'user_id':request.user.id, 'year':date_year, 'month':date_month, 'departament':departament, 'dept_name':dept_name})
            else:
                return render(request, 'accessDenied/accessDenied.html')
        else:
            return render(request, 'checkInControl/checkInControl.html',{'role': ca.role, 'time_controls':result, 'user_id':request.user.id, 'year':date_year, 'month':date_month, 'departament':departament, 'dept_name':dept_name})

    # En otro caso redireccionamos al login
    return redirect('/login')

def export_csv(request, year, month):
    # Exportación de datos
    export_year = year
    export_month = month
    months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']

    f_export_year = year
    f_export_month = month
    if str(f_export_month) == '12':
        f_export_month = '01'
        f_export_year = int(f_export_year)+1

    data = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE (dashboard_checkindata.check_in >= TO_DATE('"+str(export_year)+"-"+str(export_month)+"-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in < TO_DATE('"+str(f_export_year)+"-"+str(int(f_export_month)+1)+"-01', 'YYYY-MM-DD')) AND dashboard_checkindata.check_out IS NOT NULL ORDER BY dashboard_checkindata.user, dashboard_checkindata.check_in ASC")
    tmpJson = serializers.serialize("json",data)
    data = json.loads(tmpJson)
    
    array_ids = []
    array_names = []
    users = Account.objects.raw("SELECT * FROM dashboard_account WHERE dashboard_account.is_active = true ORDER BY dashboard_account.id")
    tmpJson = serializers.serialize("json",users)
    users = json.loads(tmpJson)

    for u in range(len(users)):
        array_ids.append(users[u]['pk'])
        username = str(users[u]['fields']['first_name'])+' '+str(users[u]['fields']['last_name'])
        array_names.append(username)

    # SE PREPARA EL ARCHIVO
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="check_in.csv"'
    writer = csv.writer(response, delimiter=';')
    writer.writerow(['FICHAJES ESMOVIL - '+str(months[int(export_month)-1])])

    user_temp = 0
    for d in range(len(data)):
        ent = str(int((str(data[d]['fields']['check_in']).split(sep="T")[1]).split(sep=':')[0])+2)+':'+(str(data[d]['fields']['check_in']).split(sep="T")[1]).split(sep=':')[1]
        sal = str(int((str(data[d]['fields']['check_out']).split(sep="T")[1]).split(sep=':')[0])+2)+':'+(str(data[d]['fields']['check_out']).split(sep="T")[1]).split(sep=':')[1]

        if data[d]['fields']['user'] == user_temp:
            writer.writerow(['',str(data[d]['fields']['check_in']).split(sep='T')[0],ent,sal])
        else:
            if data[d]['fields']['user'] in array_ids:
                position = 0
                for a in range(len(array_ids)):
                    if array_ids[a] == data[d]['fields']['user']:
                        position = a
                        break

                writer.writerow([''])
                writer.writerow([array_names[position],'Dia','Entrada','Salida'])
                user_temp = array_ids[position]
                writer.writerow(['',str(data[d]['fields']['check_in']).split(sep='T')[0],ent,sal])

    return response

def export_csv_dept(request, year, month, dept): # Hay que sacar todos los usuarios que pertenecen a ese dept y que están en uso. Después hay que meter en la consulta de abajo una condición user IN ("lista de usuarios")
    # Exportación de datos
    export_year = year
    export_month = month
    months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']

    f_export_year = year
    f_export_month = month
    if str(f_export_month) == '12':
        f_export_month = '01'
        f_export_year = int(f_export_year)+1

    data = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE (dashboard_checkindata.check_in >= TO_DATE('"+str(export_year)+"-"+str(export_month)+"-01', 'YYYY-MM-DD') AND dashboard_checkindata.check_in < TO_DATE('"+str(f_export_year)+"-"+str(int(f_export_month)+1)+"-01', 'YYYY-MM-DD')) AND dashboard_checkindata.check_out IS NOT NULL ORDER BY dashboard_checkindata.user, dashboard_checkindata.check_in ASC")
    tmpJson = serializers.serialize("json",data)
    data = json.loads(tmpJson)
    
    array_ids = []
    array_names = []
    users = Account.objects.raw("SELECT * FROM dashboard_account JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true AND dashboard_ca.departament_id = "+str(dept)+" ORDER BY dashboard_account.id")
    tmpJson = serializers.serialize("json",users)
    users = json.loads(tmpJson)

    for u in range(len(users)):
        array_ids.append(users[u]['pk'])
        username = str(users[u]['fields']['first_name'])+' '+str(users[u]['fields']['last_name'])
        array_names.append(username)

    # SE PREPARA EL ARCHIVO
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="check_in.csv"'
    writer = csv.writer(response, delimiter=';')
    writer.writerow(['FICHAJES ESMOVIL - '+str(months[int(export_month)-1])])

    user_temp = 0
    for d in range(len(data)):
        ent = str(int((str(data[d]['fields']['check_in']).split(sep="T")[1]).split(sep=':')[0])+2)+':'+(str(data[d]['fields']['check_in']).split(sep="T")[1]).split(sep=':')[1]
        sal = str(int((str(data[d]['fields']['check_out']).split(sep="T")[1]).split(sep=':')[0])+2)+':'+(str(data[d]['fields']['check_out']).split(sep="T")[1]).split(sep=':')[1]

        if data[d]['fields']['user'] == user_temp:
            writer.writerow(['',str(data[d]['fields']['check_in']).split(sep='T')[0],ent,sal])
        else:
            if data[d]['fields']['user'] in array_ids:
                position = 0
                for a in range(len(array_ids)):
                    if array_ids[a] == data[d]['fields']['user']:
                        position = a
                        break

                writer.writerow([''])
                writer.writerow([array_names[position],'Dia','Entrada','Salida'])
                user_temp = array_ids[position]
                writer.writerow(['',str(data[d]['fields']['check_in']).split(sep='T')[0],ent,sal])

    return response