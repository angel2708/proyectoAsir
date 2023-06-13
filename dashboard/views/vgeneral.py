from django.shortcuts import redirect, render, HttpResponse
from dashboard.models import Departament, Account, CA, CheckInData
from django.core import serializers
from django.http import JsonResponse, HttpResponseNotFound
from django.contrib import messages
from django.template import loader
from django.conf import settings
from django.core.mail import EmailMultiAlternatives,send_mail
import json

from django.db import connection

from django.views.defaults import page_not_found
from dashboard.functions import functions
from datetime import datetime, timezone
import pytz
from django.db.models import Q

def dashboard(request):
    if request.user.is_authenticated:
        return redirect('/users-management/'+str(request.user.id))
    else:
        return render(request, 'login/login.html')

def clientesAdquiridos(request):
    return render(request, 'clientes/appClientes.html')

def proveedores(request):
    return render(request, 'clientes/appClientes.html')

def contactos(request):
    return render(request, 'clientes/appClientes.html')

def email(request):
    if request.POST.get('action') == 'send-mail' :
        user_from = request.POST.get('from')
        user_to = request.POST.get('to')
        subject = request.POST.get('subject')
        content = request.POST.get('content')
        message=loader.render_to_string('mailing/emailVerification.html')
        print(message)

        # MANTENER COMENTADO HASTA QUE SE SOLUCIONE LO DE MANDAR CORREOS

        # mail = send_mail(subject, content, user_from, [user_to],fail_silently=False,html_message=message)

        return HttpResponse(message)


    return render(request, 'appEmail/appEmail.html')

def chat(request):
    return render(request, 'appChat/appChat.html')

def mantenimiento(request, excepcion=None):
    return HttpResponseNotFound("Page not found")

def error_404(request, exception):
    return render(request, '404/app404.html')
    
def get_agents(request):
    resultado = Account.objects.raw("SELECT dashboard_account.* FROM dashboard_account JOIN dashboard_ca ON dashboard_account.id=dashboard_ca.user_id WHERE role=2 AND on_use = true")
    tmpJson = serializers.serialize("json",resultado)
    tmpObj = json.loads(tmpJson)
    return HttpResponse(json.dumps(tmpObj))

def pruebas(request):
    return render(request, 'testing/testing.html')

def checkData(request):
    if request.user.is_authenticated:
        device = request.POST.get('device')
        UTC = pytz.utc
        today = datetime.now(UTC)
        working = 'no'

        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]

        if request.POST.get('action') == 'check_in_data':
            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.company_id = "+str(ca.company_id)+" and dashboard_checkindata.user="+str(request.user.id)+" ORDER BY check_in DESC LIMIT 1")

            if len(check) > 0:
                for i in range(len(check)):
                    if check[i].check_out:
                        x = CheckInData.objects.create(
                            user = request.user.id,
                            aproved = 0,
                            deleted = 0,
                            device_in = device,
                            company_id = ca.company_id
                        )
                    else:
                        if (str(check[i].check_in).split(sep="-")[2]).split(sep=" ")[0] != (str(today).split(sep="-")[2]).split(sep=" ")[0]:
                            x = CheckInData.objects.create(
                                user = request.user.id,
                                aproved = 0,
                                deleted = 0,
                                device_in = device,
                                company_id = ca.company_id
                            )
            else:
                x = CheckInData.objects.create(
                    user = request.user.id,
                    aproved = 0,
                    deleted = 0,
                    device_in = device,
                    company_id = ca.company_id
                )

        if request.POST.get('action') == 'check_out_data':
            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.company_id = "+str(ca.company_id)+" and dashboard_checkindata.user="+str(request.user.id)+" ORDER BY check_in DESC LIMIT 1")

            for i in range(len(check)):
                check[i].check_out = datetime.now(UTC)
                check[i].device_out = device
                check[i].save()

                start = (str(check[i].check_in).split(sep=" ")[1]).split(sep=":")[0]+':'+(str(check[i].check_in).split(sep=" ")[1]).split(sep=":")[1]
                end = (str(check[i].check_out).split(sep=" ")[1]).split(sep=":")[0]+':'+(str(check[i].check_out).split(sep=" ")[1]).split(sep=":")[1]

                if start == end:
                    check[i].delete()

        if request.POST.get('action') == 'tooltip_data':
            year = request.POST.get('year')
            month = request.POST.get('month')
            day = request.POST.get('day')

            ci_list = []
            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.company_id = "+str(ca.company_id)+" and dashboard_checkindata.user="+str(request.user.id)+" ORDER BY id DESC LIMIT 10")

            for i in range(len(check)):
                ci_year = str(check[i].check_in).split(sep="-")[0]
                ci_month = str(check[i].check_in).split(sep="-")[1]
                ci_day = (str(check[i].check_in).split(sep="-")[2]).split(sep=" ")[0]
                
                if (year == ci_year) and (month == ci_month) and (day == ci_day):
                    ci_list.append(check[i])

            tmpJson = serializers.serialize("json",ci_list)
            tmpObj = json.loads(tmpJson)
            return HttpResponse(json.dumps(tmpObj))

        if request.POST.get('action') == 're_count':
            now = datetime.now()
            now_date = str(now).split(sep=" ")[0]
            now_time = str(now).split(sep=".")[0].split(sep=" ")[1]

            hours_count = 0
            minutes_count = 0
            seconds_count = 0

            check = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.company_id = "+str(ca.company_id)+" and dashboard_checkindata.user="+str(request.user.id)+" ORDER BY id DESC LIMIT 10")

            for i in range(len(check)):
                check_in_date = str(check[i].check_in).split(sep=" ")[0]
                check_out_date = str(check[i].check_out).split(sep=" ")[0]
            
                if (check_in_date == now_date) and check_out_date != 'None':
                    diff = check[i].check_out - check[i].check_in

                    hours_count = hours_count + int(str(diff).split(sep=":")[0])
                    minutes_count = minutes_count + int(str(diff).split(sep=":")[1])
                    seconds_count = seconds_count + int((str(diff).split(sep=":")[2]).split(sep='.')[0])

                if (check_in_date == now_date) and check_out_date == 'None':
                    working = 'yes'
                    now_hours = int(now_time.split(sep=':')[0])
                    now_minutes = int(now_time.split(sep=':')[1])
                    now_seconds = int(now_time.split(sep=':')[2])

                    dt = datetime.fromisoformat(now_date)
                    dt = dt.astimezone()
                    dt = int((str(dt).split(sep='+')[1]).split(sep=':')[0])

                    check_hours = int((str(check[i].check_in).split(sep=' ')[1]).split(sep=':')[0])
                    check_hours = check_hours+dt
                    
                    check_minutes = int((str(check[i].check_in).split(sep=' ')[1]).split(sep=':')[1])
                    check_seconds = int(((str(check[i].check_in).split(sep=' ')[1]).split(sep=':')[2]).split(sep='.')[0])

                    total_hours = now_hours-check_hours
                    total_minutes = now_minutes-check_minutes
                    total_seconds = now_seconds-check_seconds

                    if total_seconds < 0:
                        total_seconds = total_seconds+60
                        total_minutes = total_minutes-1
                    
                    if total_minutes < 0:
                        total_minutes = total_minutes+60
                        total_hours = total_hours-1

                    hours_count = hours_count + total_hours
                    minutes_count = minutes_count + total_minutes
                    seconds_count = seconds_count + total_seconds

            while seconds_count >= 60:
                seconds_count = seconds_count-60
                minutes_count = minutes_count+1

            while minutes_count >= 60:
                minutes_count = minutes_count-60
                hours_count = hours_count+1

            return HttpResponse(str(hours_count)+':'+str(minutes_count)+':'+str(seconds_count)+':'+working)

        return HttpResponse('ok')

    # En otro caso redireccionamos al login
    return redirect('/login')