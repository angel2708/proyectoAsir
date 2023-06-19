from django.shortcuts import render, HttpResponse, Http404, redirect
from dashboard.models import AbsenceMedia, Companies, Account, Departament, CA, Absence
from django.core import serializers
from django.http import JsonResponse
from django.contrib import messages
from django.db import connection
import json
import textwrap
import datetime

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

# Enviar correos desde Django
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

#GUARDAR DATOS DE VACACIONES
# Obtener Company
def getCompany(request):
    if request.user.is_authenticated:
        company = Companies.objects.raw("SELECT * FROM dashboard_companies WHERE id=1")
        tmpJson = serializers.serialize("json",company)
        tmpObj = json.loads(tmpJson)
        return HttpResponse(json.dumps(tmpObj))

# --- GESTIÓN DE VACACIONES --- #
def vacations(request):
    ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
    company_id = ca.company_id
    departament_id = ca.departament_id

    company = Companies.objects.get(pk=company_id)
    total_vacation_days = company.vacation_days

    user = Account.objects.get(pk=request.user.id)
    vacation_days = user.vacation_days
    pending_days = user.pending_days
    vacation_days_next = user.vacation_days_next

    free_days = int(total_vacation_days)-int(vacation_days)
    total_free_days = int(free_days) +int(pending_days)

    if request.user.id == 18 or request.user.id == 64: # Estos usuarios van a ver las ausencias de TODOS los empleados de la empresa
        absences = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.first_name, dashboard_account.last_name, dashboard_absencemedia.file FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user FULL OUTER JOIN dashboard_absencemedia ON dashboard_absencemedia.absence_id = dashboard_absence.id WHERE dashboard_absence.deleted = 0 AND dashboard_account.is_active = true AND date_part('year', public.dashboard_absence.start) = date_part('year', CURRENT_DATE)")
        for i in range(len(absences)):
            absences[i].description='<br>'.join(l for line in absences[i].description.splitlines() for l in textwrap.wrap(line, width=50))
    else:
        absences = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.first_name, dashboard_account.last_name, dashboard_absencemedia.file FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user FULL OUTER JOIN dashboard_absencemedia ON dashboard_absencemedia.absence_id = dashboard_absence.id WHERE dashboard_absence.deleted = 0 AND dashboard_account.is_active = true AND departament = "+str(departament_id)+" AND date_part('year', public.dashboard_absence.start) = date_part('year', CURRENT_DATE)")
        for i in range(len(absences)):
            absences[i].description='<br>'.join(l for line in absences[i].description.splitlines() for l in textwrap.wrap(line, width=50))

    if request.POST.get('action') == 'add_absence':
        count = request.POST.get('count')
        user = request.POST.get('user')
        departament = request.POST.get('departament')
        absence_type = request.POST.get('absence_type')
        description = request.POST.get('description')
        start = request.POST.get('start')
        finish = request.POST.get('finish')
        manager = request.POST.get('manager')
        diff_act = request.POST.get('diff_act')
        diff_next = request.POST.get('diff_next')
        diff = request.POST.get('diff')

        this_ca = CA.objects.get(user_id=user)

        this_user = Account.objects.get(pk=user)
        vacation_days = this_user.vacation_days

        username = str(this_user.first_name)+' '+str(this_user.last_name)

        if absence_type == str(1):
            absence_type2 = 'Vacaciones'
        elif absence_type == str(2):
            absence_type2 = 'Enfermedad'
        elif absence_type == str(3):
            absence_type2 = 'Enfermedad de Familiar'
        elif absence_type == str(4):
            absence_type2 = 'Maternidad/Paternidad'
        elif absence_type == str(5):
            absence_type2 = 'Otro'
        elif absence_type == str(6):
            absence_type2 = 'Vacaciones Pendientes'

        months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
        sd = start.split(sep='-')[2]
        sm = start.split(sep='-')[1]
        sm2 = int(sm)-1
        sy = start.split(sep='-')[0]
        start2 = str(sd)+' de '+str(months[int(sm2)])+' de '+str(sy)

        fd = finish.split(sep='-')[2]
        fm = finish.split(sep='-')[1]
        fm2 = int(fm)-1
        fy = finish.split(sep='-')[0]
        finish2 = str(fd)+' de '+str(months[int(fm2)])+' de '+str(fy)

        dept = Departament.objects.get(pk=departament_id)
        manager = dept.manager

        # if manager != 0:
        #     this_user2 = Account.objects.get(pk=manager)
        #     manager_mail = this_user2.email

        this_user_ca = CA.objects.get(user_id=user)
        this_user_ca_dept = this_user_ca.departament_id

        abs_purchases = Absence.objects.raw(
            "SELECT dashboard_absence.* FROM dashboard_absence WHERE dashboard_absence.departament = 3 AND dashboard_absence.deleted = 0 AND dashboard_absence.state = 1 AND dashboard_absence.user <> 17 AND dashboard_absence.start = '" + start + "' AND dashboard_absence.finish = '" + finish + "'")
        abs_sales = Absence.objects.raw(
            "SELECT dashboard_absence.* FROM dashboard_absence WHERE dashboard_absence.departament = 4 AND dashboard_absence.user = " + str(this_user_ca.mirror) + " AND dashboard_absence.state = 1 AND dashboard_absence.deleted = 0 AND dashboard_absence.start = '" + start + "' AND dashboard_absence.finish = '" + finish + "'")
        
        # Vacaciones compras solo un usuario por semana
        if int(departament) == 3 and int(len(abs_purchases)) > 0 and int(diff) == 7 and int(user) != 17:
            id_user = abs_purchases[0].user
            
            user_abs = Account.objects.get(pk=id_user)
            name_user = str(user_abs.first_name) + ' ' + str(user_abs.last_name)
            return HttpResponse('overlapping/*/*'+str(name_user))

        # Vacaciones ventas solo un espejo por semana   
        if int(departament) == 4 and int(len(abs_sales)) > 0 and int(diff) == 7:
            id_user = abs_sales[0].user
            
            user_abs = Account.objects.get(pk=id_user)
            name_user = str(user_abs.first_name) + ' ' + str(user_abs.last_name)
            return HttpResponse('overlapping/*/*'+str(name_user))

        dateStart = datetime.date(int(sy), int(sm), int(sd))
        dateFinish = datetime.date(int(fy), int(fm), int(fd))
        yearAct = datetime.date.today().strftime('%Y')

        # Según el tipo de ausencia resta o no días de vacaciones
        # Vacaciones año anterior
        if absence_type == str(6):
            if str(sm) == '01' or str(fm) == '01' or str(sm) == '02' or str(fm) == '02':
                if str(manager) == str(request.user.id):
                    if int(diff) <= int(this_user.pending_days):
                            state = 1
                            this_user.pending_days = int(this_user.pending_days)-int(diff)
                            this_user.save()
                    else:
                        return HttpResponse('error')
                elif request.user.id == 18 or request.user.id == 64 or request.user.id == 51 or request.user.id == 45:
                    if int(diff) <= int(this_user.pending_days):
                        state = 1
                        this_user.pending_days = int(this_user.pending_days)+int(diff)
                        this_user.save()
                    else:
                        return HttpResponse('error')
                else:
                    if int(diff) <= int(this_user.pending_days):
                        state = 0
                    else:
                        return HttpResponse('error')
            else: 
                return HttpResponse('pendientes')
        
        # Vacaciones año actual
        if absence_type == str(1):
            while dateFinish >= dateStart:
                yearAbs = dateStart.strftime('%Y')
                if int(yearAct) == int(yearAbs):
                    if str(manager) == str(request.user.id):
                        if (int(vacation_days)+int(diff_act)) <= total_vacation_days:
                            state = 1
                            this_user.vacation_days = int(this_user.vacation_days)+int(1)
                            this_user.save()
                        else:
                            return HttpResponse('error')
                    elif request.user.id == 18 or request.user.id == 64 or request.user.id == 51 or request.user.id == 45:
                        if (int(vacation_days)+int(diff_act)) <= total_vacation_days:
                            state = 1
                            this_user.vacation_days = int(this_user.vacation_days)+int(1)
                            this_user.save()
                        else:
                            return HttpResponse('error')
                    else:
                        if (int(vacation_days)+int(diff_act)) <= total_vacation_days:
                            state = 0
                        else:
                            return HttpResponse('error')
                else:
                    if str(manager) == str(request.user.id):
                        if (int(vacation_days_next)+int(diff_next)) <= total_vacation_days:
                            state = 1
                            this_user.vacation_days_next = int(this_user.vacation_days_next)+int(1)
                            this_user.save()
                        else: 
                            return HttpResponse('error2')
                    elif request.user.id == 18 or request.user.id == 64 or request.user.id == 51 or request.user.id == 45:
                        if (int(vacation_days_next)+int(diff_next)) <= total_vacation_days:
                            state = 1
                            this_user.vacation_days_next = int(this_user.vacation_days_next)+int(1)
                            this_user.save()
                        else:
                            return HttpResponse('error2')
                    else:
                        if (int(vacation_days_next)+int(diff_next)) <= total_vacation_days:
                            state = 0
                        else:
                            return HttpResponse('error2')
                dateStart = dateStart + datetime.timedelta(days=1)
            
            if (str(manager) == str(request.user.id) or (request.user.id == 18)):
                departament = this_user_ca_dept
               
            new_absence = Absence.objects.create(
                user = user,
                departament = departament,
                absence_type = absence_type,
                description = description,
                start = start,
                finish = finish,
                state = state,
                company_id = this_ca.company_id
            )

            ida = new_absence.id
            abs = Absence.objects.raw("SELECT dashboard_absence.* FROM dashboard_absence WHERE dashboard_absence.id = "+str(ida)+"")
            abs_user = Account.objects.raw("SELECT dashboard_account.* FROM dashboard_account WHERE dashboard_account.id = "+str(user)+"")

            tmpJson = serializers.serialize("json",abs)
            tmpObj = json.loads(tmpJson)
            json_abs = json.dumps(tmpObj)
            tmpJson = serializers.serialize("json",abs_user)
            tmpObj = json.loads(tmpJson)
            json_abs_user = json.dumps(tmpObj)

            # Enviamos el correo electrónico avisando de una petición de ausencia
            try:
                host = request.META['HTTP_HOST']
                subject = str(username)+" ha solicitado una ausencia"
                template_name = "mailing/absenceMail.html"
                mail = create_mail('angeliyovalderrubio3@gmail.com', subject, template_name, {'host':host, 'username':username, 'absence_type':absence_type2, 'description':description, 'start':start2, 'finish':finish2})
                mail.send(fail_silently=False)
            except:
                print("Límite de correos alcanzado")

            return HttpResponse('{"abs":'+json_abs+',"abs_user":'+json_abs_user+'}')

        else:
            if str(manager) == str(request.user.id):
                state = 1
            elif request.user.id == 18 or request.user.id == 64 or request.user.id == 51 or request.user.id == 45:
                state = 1
            else:
                state = 0

            if (str(manager) == str(request.user.id) or (request.user.id == 18)):
                departament = this_user_ca_dept

            new_absence = Absence.objects.create(
                user = user,
                departament = departament,
                absence_type = absence_type,
                description = description,
                start = start,
                finish = finish,
                state = state,
                company_id = this_ca.company_id
            )

            if int(count) - 2 > 0:
                new_absence.has_media = True

            for i in range(int(count)-2):

                r = request.FILES['r'+str(i)]

                AbsenceMedia.objects.create(
                    absence_id=new_absence.id,
                    file=r,
                )

            ida = new_absence.id
            abs = Absence.objects.raw("SELECT dashboard_absence.* FROM dashboard_absence WHERE dashboard_absence.id = "+str(ida))
            abs_user = Account.objects.raw("SELECT dashboard_account.* FROM dashboard_account WHERE dashboard_account.id = "+str(user)+"")
            abs_media = AbsenceMedia.objects.raw("SELECT dashboard_absencemedia.* FROM dashboard_absencemedia WHERE dashboard_absencemedia.absence_id = "+str(ida)+"")

            tmpJson = serializers.serialize("json",abs)
            tmpObj = json.loads(tmpJson)
            json_abs = json.dumps(tmpObj)
            tmpJson = serializers.serialize("json",abs_user)
            tmpObj = json.loads(tmpJson)
            json_abs_user = json.dumps(tmpObj)
            tmpJson = serializers.serialize("json", abs_media)
            tmpObj = json.loads(tmpJson)
            json_abs_media = json.dumps(tmpObj)

            # Enviamos el correo electrónico avisando de una petición de ausencia
            try:
                host = request.META['HTTP_HOST']
                subject = str(username)+" ha solicitado una ausencia"
                template_name = "mailing/absenceMail.html"
                mail = create_mail('angeliyovalderrubio3@gmail.com', subject, template_name, {'host':host, 'username':username, 'absence_type':absence_type2, 'description':description, 'start':start2, 'finish':finish2})
                mail.send(fail_silently=False)
            except:
                print("Límite de correos alcanzado")

            return HttpResponse('{"abs":'+json_abs+',"abs_user":'+json_abs_user+', "abs_media": '+json_abs_media+'}')

    if request.POST.get('action') == 'accept_absence':
        ida = request.POST.get('ida')
        diff = request.POST.get('diff')
        diff_act = request.POST.get('diff_act')
        diff_next = request.POST.get('diff_next')
        user = request.POST.get('user')

        this_user = Account.objects.get(pk=user)
        vacation_days = this_user.vacation_days

        abs = Absence.objects.get(pk=ida)
        start = str(abs.start)
        sy = start.split(sep='-')[0]
        sm = start.split(sep='-')[1]
        sd = start.split(sep='-')[2]
        finish = str(abs.finish)
        fy = finish.split(sep='-')[0]
        fm = finish.split(sep='-')[1]
        fd = finish.split(sep='-')[2]
        
        yearAct2 = datetime.date.today().strftime('%Y')
        dateStart2 = datetime.date(int(sy), int(sm), int(sd))
        dateFinish2 = datetime.date(int(fy), int(fm), int(fd))
        
        if str(abs.absence_type) == str(1):
            while dateFinish2 >= dateStart2:
                yearAbs2 = dateStart2.strftime('%Y')
                if int(yearAbs2) == int(yearAct2):
                    if (int(vacation_days)+int(diff_act)) <= total_vacation_days:
                        abs = Absence.objects.get(pk=ida)
                        abs.state = 1
                        abs.save()

                        this_user = Account.objects.get(pk=abs.user)
                        this_user.vacation_days = int(this_user.vacation_days)+int(1)
                        this_user.save() 
                    else:
                        return HttpResponse("error")
                else:
                    if int(0) == int(0):
                        if (int(vacation_days_next)+int(diff_next)) <= total_vacation_days:
                            abs = Absence.objects.get(pk=ida)
                            abs.state = 1
                            abs.save()

                            this_user = Account.objects.get(pk=abs.user)
                            this_user.vacation_days_next = int(this_user.vacation_days_next)+int(1)
                            this_user.save()
                        else: 
                            return HttpResponse('error')
                dateStart2 = dateStart2 + datetime.timedelta(days=1)
            return HttpResponse(abs.user)

        if str(abs.absence_type) == str(6):
            if (int(this_user.pending_days)-int(diff)) >= 0:
                abs = Absence.objects.get(pk=ida)
                abs.state = 1
                abs.save()

                this_user = Account.objects.get(pk=abs.user)
                this_user.pending_days = int(this_user.pending_days)-int(diff)
                this_user.save()
                return HttpResponse(abs.user)
            else:
                return HttpResponse("error")
        else:
            abs = Absence.objects.get(pk=ida)
            abs.state = 1
            abs.save()

            return HttpResponse(abs.user)

    if request.POST.get('action') == 'cancel_absence':
        ida = request.POST.get('ida')
        diff = request.POST.get('diff')
        user = request.POST.get('user')

        abs = Absence.objects.get(pk=ida)
        abs.deleted = 1
        abs.save()

        dept = Departament.objects.get(pk=departament_id)
        # manager_id = dept.manager
        # manager = Account.objects.get(pk=manager_id)
        # manager_mail = manager.email
        # manager_username = str(manager.first_name)+' '+str(manager.last_name)

        if str(request.user.id) or str(request.user.id) == '45' or str(request.user.id) == '51':
            absence_user = Account.objects.get(pk=abs.user)
            username = str(absence_user.first_name)+' '+str(absence_user.last_name)
            user_mail = absence_user.email

            months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
            sd = str(abs.start).split(sep='-')[2]
            sm = str(abs.start).split(sep='-')[1]
            sm = int(sm)-1
            sy = str(abs.start).split(sep='-')[0]
            start2 = str(sd)+' de '+str(months[int(sm)])+' de '+str(sy)

            fd = str(abs.finish).split(sep='-')[2]
            fm = str(abs.finish).split(sep='-')[1]
            fm = int(fm)-1
            fy = str(abs.finish).split(sep='-')[0]
            finish2 = str(fd)+' de '+str(months[int(fm)])+' de '+str(fy)

            if abs.absence_type == 1:
                absence_type2 = 'Vacaciones'
            elif abs.absence_type == 2:
                absence_type2 = 'Enfermedad'
            elif abs.absence_type == 3:
                absence_type2 = 'Enfermedad de Familiar'
            elif abs.absence_type == 4:
                absence_type2 = 'Maternidad/Paternidad'
            elif abs.absence_type == 5:
                absence_type2 = 'Otro'

            # Enviamos el correo electrónico avisando del rechazo de una ausencia
            try:
                host = request.META['HTTP_HOST']
                subject = "Se ha rechazado tu solicitud de ausencia"
                template_name = "mailing/absenceMailCancel.html"
                mail = create_mail(user_mail, subject, template_name, {'host':host, 'username':username, 'absence_type':absence_type2, 'description':abs.description, 'start':start2, 'finish':finish2})
                mail.send(fail_silently=False)
                mail = create_mail('angeliyovalderrubio3@gmail.com', subject, template_name, {'host':host, 'username':username, 'absence_type':absence_type2, 'description':abs.description, 'start':start2, 'finish':finish2})
                mail.send(fail_silently=False)
            except:
                print("Límite de correos alcanzado")

        return HttpResponse(abs.absence_type)

    if request.POST.get('action') == 'delete_absence':
        ida = request.POST.get('ida')
        diff_act = request.POST.get('diff_act')
        diff_next = request.POST.get('diff_next')
        diff = request.POST.get('diff')
        user = request.POST.get('user')

        abs = Absence.objects.get(pk=ida)
        abs.deleted = 1

        if str(abs.absence_type) == str(1):
            this_user = Account.objects.get(pk=abs.user)
            this_user.vacation_days = int(this_user.vacation_days)-int(diff_act)
            this_user.vacation_days_next = int(this_user.vacation_days_next)-int(diff_next)
            this_user.save()
        elif str(abs.absence_type) == str(6):
            this_user = Account.objects.get(pk=abs.user)
            this_user.pending_days = int(this_user.pending_days)+int(diff_act)
            this_user.save()

        abs.save()

        return HttpResponse(abs.absence_type)

    if request.POST.get('action') == 'full_calendar':
        master_dept = request.POST.get('master_dept')
        # USUARIO DE JOSEMI O DE JUANFRAN
        if request.user.id == 18 or request.user.id == 64:
            if master_dept == 0:
                absences = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.first_name, dashboard_account.last_name FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE dashboard_absence.deleted = 0 AND dashboard_account.is_active = true")
            else:
                absences = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.first_name, dashboard_account.last_name FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE dashboard_absence.deleted = 0 AND dashboard_absence.departament="+str(master_dept)+" AND dashboard_account.is_active = true")
            users = Account.objects.raw("SELECT dashboard_ca.user_id, dashboard_ca.departament_id, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_account INNER JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true")
        else:
            absences = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.first_name, dashboard_account.last_name FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE dashboard_absence.deleted = 0 AND (dashboard_absence.departament="+str(ca.departament_id)+" OR dashboard_absence.user="+str(request.user.id)+") AND dashboard_account.is_active = true")
            users = Account.objects.raw("SELECT dashboard_ca.user_id, dashboard_ca.departament_id, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_account INNER JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true AND dashboard_ca.departament_id="+str(master_dept))

        tmpJson = serializers.serialize("json",absences)
        tmpObj = json.loads(tmpJson)
        json_absences = json.dumps(tmpObj)

        tmpJson = serializers.serialize("json",users)
        tmpObj = json.loads(tmpJson)
        json_users = json.dumps(tmpObj)

        return HttpResponse('{"absences":'+json_absences+',"users":'+json_users+'}')

    if request.POST.get('action') == 'full_calendar_month':
        master_dept = request.POST.get('master_dept')
        cursor = connection.cursor()
        cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
	            to_char(V.start, 'YYYY-MM-DD') AS start,
	            to_char(V.finish, 'YYYY-MM-DD') AS finish	
	            FROM dashboard_absence V 
                JOIN dashboard_account A ON A.id = V.user
	            WHERE V.deleted = 0 AND A.is_active = true AND V.departament='''+str(master_dept)+' ORDER BY V.start')
        absences = functions.rawSerializer(cursor)
        return HttpResponse(absences)

    if request.POST.get('action') == 'show_user_month':
        user_id = request.POST.get('user_id')
        cursor = connection.cursor()
        cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
                to_char(V.start, 'YYYY-MM-DD') AS start,
                to_char(V.finish, 'YYYY-MM-DD') AS finish	
                FROM dashboard_absence V 
                JOIN dashboard_account A ON A.id = V.user
                WHERE V.deleted = 0 AND A.is_active = true AND V."user" IN ('''+str(user_id)+') ORDER BY V.start')
        absences = functions.rawSerializer(cursor)
        return HttpResponse(absences)

    if request.POST.get('action') == 'show_dept_month':
        dept_id = request.POST.get('dept_id')
        cursor = connection.cursor()
        cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
	            to_char(V.start, 'YYYY-MM-DD') AS start,
	            to_char(V.finish, 'YYYY-MM-DD') AS finish	
	            FROM dashboard_absence V 
                JOIN dashboard_account A ON A.id = V.user
	            WHERE V.deleted = 0 AND A.is_active = true AND V.departament='''+str(dept_id)+' ORDER BY V.start')
        absences = functions.rawSerializer(cursor)
        return HttpResponse(absences)

    if request.user.id == 18 or request.user.id == 64: #Usuarios Josemi y Juanfran - Deben ver todos los usuario de la empresa
        users = Account.objects.raw("SELECT dashboard_ca.*, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_account INNER JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true and (dashboard_ca.user_id != 84 and dashboard_ca.user_id != 13 and dashboard_ca.user_id != 16) ORDER BY dashboard_account.first_name")
    else:
        users = Account.objects.raw("SELECT dashboard_ca.*, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_account INNER JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true AND dashboard_ca.departament_id="+str(departament_id)+" and (dashboard_ca.user_id != 84 and dashboard_ca.user_id != 13 and dashboard_ca.user_id != 16) ORDER BY dashboard_account.first_name")

    departaments = Departament.objects.raw("SELECT dashboard_departament.* FROM dashboard_departament WHERE dashboard_departament.id != 9")

    month = datetime.datetime.now().month
    year = datetime.datetime.now().year

    try:
        dept_name = Departament.objects.get(pk=departament_id)
        return render(request, 'vacations/vacations.html',{'vacations':vacations, 'ca':ca, 'month':month, 'year':year, 'dept_name':dept_name, 'users':users, 'departaments':departaments, 'role':ca.role, 'absences':absences, 'total_vacation_days':total_vacation_days, 'vacation_days':vacation_days, 'vacation_days_next':vacation_days_next, 'pending_days':pending_days, 'free_days':free_days, 'total_free_days':total_free_days})
    except:
        return render(request, 'accessDenied/accessDenied.html')

# MOSTRAR VACACIONES DEL USUARIO EN EL PREVIEW
def showVacations(request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        departament_id = ca.departament_id

        # Mostrar las vacaciones de ese usuario
        if request.POST.get('action') == 'show_user':
            user_id = request.POST.get('user_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE dashboard_absence.user = "+user_id+" AND dashboard_absence.deleted = 0 AND dashboard_account.is_active = true")           
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones de ese departamento
        if request.POST.get('action') == 'show_dept':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")           
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones aceptadas
        if request.POST.get('action') == 'show_accepted':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE state=1 AND absence_type=1 AND departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        if request.POST.get('action') == 'show_accepted_month':
            dept_id = request.POST.get('dept_id')
            cursor = connection.cursor()
            cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
                    to_char(V.start, 'YYYY-MM-DD') AS start,
                    to_char(V.finish, 'YYYY-MM-DD') AS finish	
                    FROM dashboard_absence V 
                    JOIN dashboard_account A ON A.id = V.user
                    WHERE V.deleted = 0 AND A.is_active = true AND V.state = 1 AND V.absence_type = 1 AND V.departament='''+str(dept_id)+' ORDER BY V.start')
            absences = functions.rawSerializer(cursor)
            return HttpResponse(absences)

        if request.POST.get('action') == 'show_pending_month':
            dept_id = request.POST.get('dept_id')
            cursor = connection.cursor()
            cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
                    to_char(V.start, 'YYYY-MM-DD') AS start,
                    to_char(V.finish, 'YYYY-MM-DD') AS finish	
                    FROM dashboard_absence V 
                    JOIN dashboard_account A ON A.id = V.user
                    WHERE V.deleted = 0 AND A.is_active = true AND V.state = 0 AND V.absence_type = 1 AND V.departament='''+str(dept_id)+' ORDER BY V.start')
            absences = functions.rawSerializer(cursor)
            return HttpResponse(absences)

        if request.POST.get('action') == 'show_lastyear_month':
            dept_id = request.POST.get('dept_id')
            cursor = connection.cursor()
            cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
                    to_char(V.start, 'YYYY-MM-DD') AS start,
                    to_char(V.finish, 'YYYY-MM-DD') AS finish	
                    FROM dashboard_absence V 
                    JOIN dashboard_account A ON A.id = V.user
                    WHERE V.deleted = 0 AND A.is_active = true AND V.absence_type = 6 AND V.departament='''+str(dept_id)+' ORDER BY V.start')
            absences = functions.rawSerializer(cursor)
            return HttpResponse(absences)

        if request.POST.get('action') == 'show_other_month':
            dept_id = request.POST.get('dept_id')
            cursor = connection.cursor()
            cursor.execute('''SELECT A.id AS u_id, A.first_name, A.last_name, V.id, V.absence_type, V.departament, V.state, V."user", V.description,
                    to_char(V.start, 'YYYY-MM-DD') AS start,
                    to_char(V.finish, 'YYYY-MM-DD') AS finish	
                    FROM dashboard_absence V 
                    JOIN dashboard_account A ON A.id = V.user
                    WHERE V.deleted = 0 AND A.is_active = true AND V.absence_type IN (2,3,4,5) AND V.departament='''+str(dept_id)+' ORDER BY V.start')
            absences = functions.rawSerializer(cursor)
            return HttpResponse(absences)

        if request.POST.get('action') == 'show_other':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE absence_type IN (2,3,4,5) AND departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")
            tmpJson = serializers.serialize("json", absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones pendientes
        if request.POST.get('action') == 'show_pending':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE state=0 AND absence_type=1 AND departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones atrasadas
        if request.POST.get('action') == 'show_lastyear':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw(
                "SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE absence_type=6 AND departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")
            tmpJson = serializers.serialize("json", absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones solapadas
        if request.POST.get('action') == 'show_repeated':
            departament_id = request.POST.get('departament_id')

            absence = Absence.objects.raw("SELECT dashboard_absence.*, dashboard_account.* FROM dashboard_absence JOIN dashboard_account ON dashboard_account.id = dashboard_absence.user WHERE departament="+departament_id+" AND deleted = 0 AND dashboard_account.is_active = true")
            tmpJson = serializers.serialize("json",absence)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        # Mostrar las vacaciones solapadas
        if request.POST.get('action') == 'get_user_list':
            departament_id = request.POST.get('departament_id')

            users = Account.objects.raw("SELECT dashboard_ca.user_id, dashboard_ca.departament_id, dashboard_account.id, dashboard_account.first_name, dashboard_account.last_name, dashboard_account.avatar FROM dashboard_account INNER JOIN dashboard_ca ON dashboard_account.id = dashboard_ca.user_id WHERE dashboard_account.is_active = true AND dashboard_ca.departament_id="+str(departament_id)+ 'ORDER BY dashboard_ca.user_id')
            tmpJson = serializers.serialize("json",users)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

    # En otro caso redireccionamos al login
    return redirect('/login')

# SACAMOS LOS DATOS DE LOS AVATARES
def getAvatars(request):
    #Comprobamos que el usuario está logueado
    if request.user.is_authenticated:

        # Detectar los datos del tooltip
        if request.POST.get('action') == 'get_avatars':
            user = request.POST.get('user')
            account = Account.objects.raw("SELECT * FROM dashboard_account WHERE id="+str(user))
            tmpJson = serializers.serialize("json",account)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

    # En otro caso redireccionamos al login
    return redirect('/login')