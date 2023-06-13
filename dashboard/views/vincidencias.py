from django.shortcuts import render, HttpResponse, Http404, redirect
from dashboard.models import Incidences, CA, Account, Departament, Commentaries, IncidencesMedia
from django.core import serializers
from django.http import JsonResponse
from django.contrib import messages
from django.db import connection
import json

import requests

from django.contrib.auth.models import User
from django.contrib.auth import logout as do_logout

from django.contrib.auth import update_session_auth_hash

from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as do_login

from dashboard.functions import functions

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.db.models import Q
import textwrap

def incidencias(request):
    ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
    company_id = ca.company_id
    commentaries = Commentaries.objects.raw("SELECT dashboard_commentaries.*, dashboard_account.* FROM dashboard_commentaries INNER JOIN dashboard_account ON dashboard_commentaries.commentator = dashboard_account.id WHERE dashboard_commentaries.company_id ="+str(company_id))
    incidences = Incidences.objects.raw("SELECT dashboard_incidences.*, dashboard_account.* FROM dashboard_incidences INNER JOIN dashboard_account ON dashboard_incidences.user_id = dashboard_account.id WHERE dashboard_incidences.company_id="+str(company_id)+" ORDER BY dashboard_incidences.id DESC LIMIT 100")
    users = Account.objects.raw('SELECT A.id, A.first_name, A.last_name FROM dashboard_ca C JOIN dashboard_account A ON A.id = C.user_id WHERE C.departament_id=2 AND is_active = true AND (A.id != 16 AND A.id != 13 AND A.id != 14)')
    
    
    ##Mostrar imágenes

    if request.POST.get('action') == 'get-img' :
    
        id = request.POST.get('id')
        imagenes = IncidencesMedia.objects.raw("SELECT * FROM dashboard_incidencesmedia WHERE incidence = " + str(id))
        
        tmpJson = serializers.serialize("json", imagenes)
        tmpObj = json.loads(tmpJson)

        return HttpResponse(json.dumps(tmpObj))


    # try:
    return render(request, 'incidencias/appIncidencias.html',{'users': users,'incidences':incidences, 'ca':ca, 'commentaries':commentaries, 'role':ca.role})
    # except:
    #     return render(request, 'accessDenied/accessDenied.html')

def isTrue(s):
    if s == 'true' or s == '1':
        return True
    else:
        return False

# Enviar correos desde Django
def create_mail(subject, template_name, context):
    content = render_to_string(template_name, context)
    message = EmailMultiAlternatives(
        subject=subject,
        body='',
        from_email=settings.EMAIL_HOST_USER,
        to=['pepepalotes12@outlook.es']
    )

    message.attach_alternative(content, 'text/html')
    return message

#GUARDAR UNA INCIDENCIA
def saveIncidence (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'save_incidence':
            user_id = request.POST.get('user_id')
            company_id = request.POST.get('company_id')
            source_departament_id = request.POST.get('source_departament_id')
            # destination_departament_id = request.POST.get('destination_departament_id')
            priority = request.POST.get('priority')
            boss_only = isTrue(request.POST.get('boss_only'))
            issue = request.POST.get('issue')
            description = request.POST.get('description')

            count = request.POST.get('count')


            incidence = Incidences.objects.create(
                user_id = user_id,
                company_id = company_id,
                source_departament_id = source_departament_id,
                destination_departament_id = 1,
                priority = priority,
                boss_only = boss_only,
                issue = issue,
                description = description,
                #------ Por defecto asigna a un Usuario (Cambiar a 64)------------
                assigned=64
            )

            # Contador imagenes
            if int(count) -2 > 0:
                incidence.has_media = True
            
            for i in range(int(count)-2):
                r = request.FILES['r'+str(i)]

                IncidencesMedia.objects.create(
                    incidence = incidence.id,
                    incidence_img = r
                )

            incidence.save()

            user = Account.objects.get(pk=user_id)
            username = user.first_name+' '+user.last_name

            p_text = ''
            if int(priority) == 0:
                p_text = 'Baja'
            elif int(priority) == 1:
                p_text = 'Media'
            elif int(priority) == 2:
                p_text = 'Alta'

            try:
                if user_id != '14' and user_id != '64': # CAMBIAR POR 14 Y 64
                    host = request.META['HTTP_HOST']
                    subject = "Nueva Incidencia - ("+p_text+")"
                    template_name = "mailing/newIncidence.html"
                    mail = create_mail(subject, template_name, {'username':username, 'issue':issue, 'description':description, 'host':host})
                    mail.send(fail_silently=False)
            except:
                return HttpResponse('Ha petado')

            user = Account.objects.raw("SELECT * FROM dashboard_account WHERE id="+str(incidence.user_id))
            tmpJson = serializers.serialize("json",user)
            tmpObj = json.loads(tmpJson)
            json_user = json.dumps(tmpObj)

            newIncidence = Incidences.objects.raw("SELECT * FROM dashboard_incidences WHERE id="+str(incidence.id))
            tmpJson = serializers.serialize("json",newIncidence)
            tmpObj = json.loads(tmpJson)
            json_incidence = json.dumps(tmpObj)
            
            return HttpResponse('{"incidence":'+json_incidence+',"user":'+json_user+'}')

    # En otro caso redireccionamos al login
    return redirect('/login')

def deleteIncidence (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'delete_incidence':
            inc_id = request.POST.get('inc_id')
            incidence = Incidences.objects.get(pk=inc_id)

            incidence.removed=True
            user_id = incidence.user_id
            issue = incidence.issue
            description = incidence.description
            incidence.save()

            user = Account.objects.get(pk=user_id)
            username = user.first_name+' '+user.last_name

            if user_id != 14 and user_id != 64: # CAMBIAR POR 14 Y 64
                host = request.META['HTTP_HOST']
                subject = "Incidencia borrada"
                template_name = "mailing/incidenceDeleted.html"
                mail = create_mail(subject, template_name, {'username':username, 'issue':issue, 'description':description, 'host':host})
                mail.send(fail_silently=False)

    # En otro caso redireccionamos al login
    return redirect('/login')

def checkIncidence (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'check_incidence':
            inc_id = request.POST.get('inc_id')

            incidence = Incidences.objects.get(pk=inc_id)
            incidence.checked=True
            incidence.state = 3

            user = Account.objects.get(pk=incidence.user_id)
            username = user.first_name
            email = user.email

            # Se envía correo a quien ha puesto la incidencia para avisarle de que está resuelta.
            def resolved_mail(subject, template_name, context):
                content = render_to_string(template_name, context)
                message = EmailMultiAlternatives(
                    subject=subject,
                    body='',
                    from_email=settings.EMAIL_HOST_USER,
                    # Manda el correo a la persona que pone la incidencia
                    to=[email]
                )

                message.attach_alternative(content, 'text/html')
                return message

            host = request.META['HTTP_HOST']
            subject = "Incidencia Resuelta"
            template_name = "mailing/resolvedIncidence.html"
            mail = resolved_mail(subject, template_name, {'username':username, 'number':inc_id, 'issue':incidence.issue, 'description':incidence.description, 'host':host})
            mail.send(fail_silently=False)

            incidence.save()

    # En otro caso redireccionamos al login
    return redirect('/login')

def uncheckIncidence (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'uncheck_incidence':
            inc_id = request.POST.get('inc_id')

            incidence = Incidences.objects.get(pk=inc_id)
            incidence.checked=False
            incidence.state = 2
            incidence.save()

    # En otro caso redireccionamos al login
    return redirect('/login')

def getIncidences(request):
    if request.user.is_authenticated:
        company_id = request.POST.get('company_id')
        inc_id = request.POST.get('inc_id')
        cursor = connection.cursor()
        cursor.execute('''SELECT incidences.id, incidences.assigned, incidences.issue, incidences.priority, incidences.description, incidences.user_id, incidences.state, assigned.first_name AS as_fn, assigned.last_name AS as_ln, author.last_name AS au_ln, author.first_name AS au_fn
            FROM dashboard_incidences AS incidences
            JOIN dashboard_account AS assigned ON incidences.assigned = assigned.id 
            JOIN dashboard_account AS author ON incidences.user_id = author.id
            WHERE incidences.id='''+str(inc_id))
        incidences = functions.rawSerializer(cursor)
        print(incidences)
        return HttpResponse(incidences)

def getDates(request):
    if request.user.is_authenticated:
        inc_id = request.POST.get('inc_id')

        incidence = Incidences.objects.raw("SELECT * FROM dashboard_incidences WHERE id="+str(inc_id))
        tmpJson = serializers.serialize("json",incidence)
        tmpObj = json.loads(tmpJson)
        json_incidence = json.dumps(tmpObj)
        
        return HttpResponse(json_incidence)

def getImages(request):
    if request.user.is_authenticated:
        inc_id = request.POST.get('inc_id')

        media = IncidencesMedia.objects.raw("SELECT * FROM dashboard_incidencesmedia WHERE incidence="+str(inc_id))
        tmpJson = serializers.serialize("json",media)
        tmpObj = json.loads(tmpJson)
        json_media = json.dumps(tmpObj) 

        return HttpResponse(json_media)

def getCommentaries(request):
    if request.user.is_authenticated:
        inc_id = request.POST.get('inc_id')
        cursor = connection.cursor()
        cursor.execute("SELECT dashboard_commentaries.*, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_commentaries INNER JOIN dashboard_account ON dashboard_commentaries.commentator = dashboard_account.id WHERE dashboard_commentaries.inc_id="+str(inc_id))
        commentaries=functions.rawSerializer(cursor)
        return HttpResponse(commentaries)

#GUARDAR CAMBIOS EN UNA INCIDENCIA
def updateIncidence (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:
        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'update_incidence':
            user_id = request.POST.get('user_id')
            inc_id = request.POST.get('inc_id')
            company_id = request.POST.get('company_id')
            issue = request.POST.get('issue')
            description = request.POST.get('description')
            modified = request.POST.get('modified')

            incidence = Incidences.objects.get(pk=inc_id)

            if modified == 'Título':
                old = incidence.issue
                new = issue
            elif modified == 'Descripción':
                old = incidence.description
                new = description

            ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
            company_id = ca.company_id

            if (str(incidence.user_id) == user_id) or ca.departament_id == 2:
                incidence.issue = issue
                incidence.description = description

                incidence.save()

                user = Account.objects.get(pk=user_id)
                username = user.first_name+' '+user.last_name

                if user_id != '14' and user_id != '64': # CAMBIAR POR 14 Y 64
                    host = request.META['HTTP_HOST']
                    subject = "Incidencia editada"
                    template_name = "mailing/incidenceEdited.html"
                    mail = create_mail(subject, template_name, {'username':username, 'number':inc_id, 'issue':issue, 'description':description, 'modified':modified, 'old':old, 'new':new, 'host':host})
                    mail.send(fail_silently=False)

            else:
                return HttpResponse("error")  

        elif request.POST.get('action') == 'modify_incidence':
            inc_id = request.POST.get('inc_id')
            new_state = request.POST.get('new_state')
            new_assigned = request.POST.get('new_assigned')
            comm = request.POST.get('comm')

            ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
            company_id = ca.company_id

            incidence = Incidences.objects.get(pk=inc_id)
            incidence.state = new_state
            incidence.assigned = new_assigned

            user = Account.objects.get(pk=incidence.user_id)
            username = user.first_name
            email = user.email

            if new_state == '3':
                # Se envía correo a quien ha puesto la incidencia para avisarle de que está resuelta.
                def resolved_mail(subject, template_name, context):
                    content = render_to_string(template_name, context)
                    message = EmailMultiAlternatives(
                        subject=subject,
                        body='',
                        from_email=settings.EMAIL_HOST_USER,
                        # Manda el correo a la persona que pone la incidencia
                        to=[email] 
                    )

                    message.attach_alternative(content, 'text/html')
                    return message

                host = request.META['HTTP_HOST']
                subject = "Incidencia Resuelta"
                template_name = "mailing/resolvedIncidence.html"
                mail = resolved_mail(subject, template_name, {'username':username, 'number':inc_id, 'issue':incidence.issue, 'comm':comm, 'description':incidence.description, 'host':host})
                mail.send(fail_silently=False)

                incidence.checked=True
			
            elif new_state == '4':
                def data_mail(subject, template_name, context):
                    content = render_to_string(template_name, context)
                    message = EmailMultiAlternatives(
                        subject=subject,
                        body='',
                        from_email=settings.EMAIL_INCIDENCES_USER,
                        # Manda el correo a la persona que pone la incidencia
                        to=[email]
                    )

                    message.attach_alternative(content, 'text/html')
                    return message

                host = request.META['HTTP_HOST']
                subject = "Faltan Datos en Incidencia"
                template_name = "mailing/dataIncidence.html"
                mail = data_mail(subject, template_name, {'username': username, 'number': inc_id, 'issue': incidence.issue, 'comm': comm, 'description': incidence.description, 'host': host})
                mail.send(fail_silently=False)

            else:
                incidence.checked=False

            incidence.save()

    # En otro caso redireccionamos al login
    return redirect('/login')

#GUARDAR UN COMENTARIO
def saveComment (request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos de la incidencia.
        if request.POST.get('action') == 'save_comment':
            commentator = request.POST.get('commentator')
            company_id = request.POST.get('company_id')
            content = request.POST.get('content')
            inc_id = request.POST.get('inc_id')
            date = request.POST.get('date')

            commentary = Commentaries(
                commentator = commentator,
                company_id = company_id,
                content = content,
                inc_id = inc_id,
                date = date
            )

            commentary.save()

    # En otro caso redireccionamos al login
    return redirect('/login')

def getManager(request):
    if request.user.is_authenticated:
        company_id = request.POST.get('company_id')
        departament_id = request.POST.get('departament_id')
        manager = Departament.objects.raw("SELECT id, manager FROM dashboard_departament WHERE id="+departament_id+" AND company_id="+company_id)
        tmpJson = serializers.serialize("json",manager)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))