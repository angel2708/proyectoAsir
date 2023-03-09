from django.shortcuts import render, HttpResponse,Http404, redirect
from dashboard.models import Account, Function, Permission, CA
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

from dashboard.views import vesmovil as esmovil
from dashboard.functions import functions

import time

from datetime import datetime, timedelta
import pytz

def getTokenUbunet():
    data={"email":"juanfran.rodriguez@esmovil.es", "password":"21516526Md"}

    url = 'https://ubcloud.ubutel.eu/api/v2/login/'
    response = requests.post(url, data=data)

    response = response.text

    return response


def get_calls():
    e_date = datetime.today().strftime('%Y-%m-%d')
    year = e_date.split(sep="-")[0]
    month = e_date.split(sep="-")[1]

    url_month = str(year)+str(month)
    url = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=2000&page=1&month='+url_month+'&company=20193'

    data ={'filters':{'direction':{"incoming":True,"outgoing":True,"internal":False},'callstatus':{"answered":True,"notAnswered":True,},'number':{"number":"228","did":""},'date':{"initDate":'2021/02/17T01:00:00.000Z',"endDate":'2021/02/18T23:59:00.000Z'}}}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'Content-Type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.post(url, headers=headers, data=data)

    return response.text


def getCallsByDate(s_date, e_date):
    e_date = datetime.today().strftime('%Y-%m-%d')
    year = e_date.split(sep="-")[0]
    month = e_date.split(sep="-")[1]

    url_month = str(year)+str(month)
    url = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=2000&page=1&month='+url_month+'&company=20193'

    data ={'filters':{'direction':{"incoming":True,"outgoing":True,"internal":False},'callstatus':{"answered":True,"notAnswered":True},'number':{"number":"","did":""},'date':{"initDate":s_date[0:10].replace('/','-')+'T'+s_date[11:26]+'Z',"endDate":e_date[0:10].replace('/','-')+'T'+e_date[11:26]+'Z'}}}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'Content-Type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.post(url, headers=headers, data=data)

    return response.text


def getCallsByExtension(extension):
    e_date = datetime.today().strftime('%Y-%m-%d')
    year = e_date.split(sep="-")[0]
    month = e_date.split(sep="-")[1]

    url_month = str(year)+str(month)
    url = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=1200&page=1&month='+url_month+''

    data ={'filters':{'direction':{"incoming":False,"outgoing":True,"internal":False},'callstatus':{"answered":True,"notAnswered":True}}}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'Content-Type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.get(url, headers=headers, data=data)

    print(response)

    l = json.loads(response.text)

    call_count = 0
    total_sec = 0
    not_answered = 0

    for i in l['data']:
        if i['src_extension'] == str(extension):
            calldate_date = datetime.strptime(i['calldate'], '%Y-%m-%d %H:%M:%S')
            initDate = datetime.strptime(str(e_date)+' 00:00:00', '%Y-%m-%d %H:%M:%S')
            endDate = datetime.strptime(str(e_date)+' 23:59:59', '%Y-%m-%d %H:%M:%S')

            if calldate_date > initDate and calldate_date < endDate:
                if i['direction'] == 'outgoing':
                    call_count = call_count +1
                    if int(i['duration']) > 4:
                        total_sec = total_sec + int(i['duration'])
                    else:
                        not_answered = not_answered + 1

    answered = call_count - not_answered

    sec_aux = str(total_sec%60)

    if len(sec_aux) == 1:
        sec_aux = '0' + sec_aux

    total_min = str(int(total_sec/60))+':'+sec_aux
    try:
        avg_sec = int(total_sec/answered)
    except:
        avg_sec = 0

    sec_aux = str(avg_sec%60)

    if len(sec_aux) == 1:
        sec_aux = '0' + sec_aux

    avg_min = str(int(avg_sec/60))+':'+sec_aux

    result = '''
        {
            "call_count":"'''+str(call_count)+'''",
            "total_min":"'''+str(total_min)+'''",
            "avg_min":"'''+str(avg_min)+'''",
            "not_answered":"'''+str(not_answered)+'''",
            "answered":"'''+str(answered)+'''"
        }
    '''

    return result


def getComercialCallsByDate(sd, ed, company):
    yesterday = datetime.now() - timedelta(1)
        
    datetime.strftime(yesterday, '%Y/%m/%d')
    offsetHour = time.altzone / 3600
    sd=datetime.strptime(sd.replace('T',' '), '%Y-%m-%d %H:%M')- timedelta(hours = -offsetHour)
    ed=datetime.strptime(ed.replace('T',' '), '%Y-%m-%d %H:%M')- timedelta(hours = -offsetHour)

    year = str(sd).split(sep="-")[0]
    month = str(sd).split(sep="-")[1]
    url_month = str(year)+str(month)

    year2 = str(ed).split(sep="-")[0]
    month2 = str(ed).split(sep="-")[1]
    url_month2 = str(year2)+str(month2)

    url = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=3000&page=1&month='+url_month+''
    url2 = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=3000&page=1&month='+url_month2+''

    data ={'filters':{'direction':{"incoming":False,"outgoing":True,"internal":False},'callstatus':{"answered":True,"notAnswered":True}}}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'Content-Type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.get(url, headers=headers, data=data)
    response2 = requests.get(url2, headers=headers, data=data)

    try:
        l = json.loads(response.text)
        k = json.loads(response2.text)

        commercials = Account.objects.raw('SELECT dashboard_account.*, dashboard_ca.* FROM dashboard_account JOIN dashboard_ca ON dashboard_account.id=dashboard_ca.user_id WHERE dashboard_ca.company_id = '+str(company)+' AND dashboard_ca.role=2 AND dashboard_ca.on_use = true AND dashboard_account.is_active = true')

        extensions = []
        names = []

        for c in commercials:
            extensions.append(c.phone)
            names.append(c.first_name +' '+ c.last_name)

        processed_ext = []
        processed_data = []

        for d in l['data']:
            calldate_date = datetime.strptime(d['calldate'], '%Y-%m-%d %H:%M:%S')
            initDate = datetime.strptime(str(sd), '%Y-%m-%d %H:%M:%S')
            endDate = datetime.strptime(str(ed), '%Y-%m-%d %H:%M:%S')

            if d['direction'] == 'outgoing':
                if calldate_date > initDate and calldate_date < endDate:
                    if d['src_extension'] in processed_ext:
                        index = processed_ext.index(d['src_extension'])

                        if int(d['duration']) < 5:
                            processed_data[index]['not_answered'] = int(processed_data[index]['not_answered'])+1
                        else:
                            processed_data[index]['answered'] = int(processed_data[index]['answered'])+1

                        processed_data[index]['calls'] = int(processed_data[index]['calls'])+1
                        processed_data[index]['seconds'] = int(processed_data[index]['seconds']) + int(d['duration'])
                        
                        try:
                            if processed_data[index]['max'] < int(d['duration']):
                                processed_data[index]['max'] = int(d['duration'])
                        except:
                            processed_data[index]['max'] = 0

                    elif d['src_extension'] in extensions:
                        index = extensions.index(d['src_extension'])

                        if int(d['duration']) < 5:
                            ans = 0
                        else:
                            ans = 1

                        processed_ext.append(d['src_extension'])
                        processed_data.append({'ext':d['src_extension'], 'name':names[index], 'calls':1, 'answered':ans, 'not_answered':1-ans, 'seconds':int(d['duration']), 'total_min':'','avg_min':'', 'max':int(d['duration'])})

        if month != month2:
            for w in k['data']:
                calldate_date = datetime.strptime(w['calldate'], '%Y-%m-%d %H:%M:%S')
                initDate = datetime.strptime(str(sd), '%Y-%m-%d %H:%M:%S')
                endDate = datetime.strptime(str(ed), '%Y-%m-%d %H:%M:%S')

                if w['direction'] == 'outgoing':
                    if calldate_date > initDate and calldate_date < endDate:
                        if w['src_extension'] in processed_ext:
                            index = processed_ext.index(w['src_extension'])

                            if int(w['duration']) < 5:
                                processed_data[index]['not_answered'] = int(processed_data[index]['not_answered'])+1
                            else:
                                processed_data[index]['answered'] = int(processed_data[index]['answered'])+1

                            processed_data[index]['calls'] = int(processed_data[index]['calls'])+1
                            processed_data[index]['seconds'] = int(processed_data[index]['seconds']) + int(w['duration'])

                            try:
                                if processed_data[index]['max'] < int(w['duration']):
                                    processed_data[index]['max'] = int(w['duration'])
                            except:
                                processed_data[index]['max'] = 0

                        elif w['src_extension'] in extensions:
                            index = extensions.index(w['src_extension'])

                            if int(w['duration']) < 5:
                                ans = 0
                            else:
                                ans = 1

                            processed_ext.append(w['src_extension'])
                            processed_data.append({'ext':w['src_extension'], 'name':names[index], 'calls':1, 'answered':ans, 'not_answered':1-ans, 'seconds':int(w['duration']), 'total_min':'','avg_min':'', 'max':int(w['duration'])})

        n = 0

        for pd in processed_data:
            sec_aux = str(pd['seconds']%60)

            if len(sec_aux) == 1:
                sec_aux = '0' + sec_aux

            total_min = str(int(pd['seconds']/60))+':'+sec_aux

            try:
                avg_sec = int(pd['seconds']/pd['answered'])
            except:
                avg_sec = 0

            sec_aux = str(avg_sec%60)

            if len(sec_aux) == 1:
                sec_aux = '0' + sec_aux

            avg_min = str(int(avg_sec/60))+':'+sec_aux

            processed_data[n]['total_min'] = total_min
            processed_data[n]['avg_min'] = avg_min

            sec_aux = str(pd['max']%60)

            if len(sec_aux) == 1:
                sec_aux = '0' + sec_aux

            total_min = str(int(pd['max']/60))+':'+sec_aux
            processed_data[n]['max'] = total_min

            n = n+1

        return json.dumps(processed_data)

    except:
        return HttpResponse('error')


def getSpecificData(sd, ed, ext):
    yesterday = datetime.now() - timedelta(1)
        
    datetime.strftime(yesterday, '%Y/%m/%d')
    offsetHour = time.altzone / 3600
    sd=datetime.strptime(sd.replace('T',' '), '%Y-%m-%d %H:%M')- timedelta(hours = -offsetHour)
    ed=datetime.strptime(ed.replace('T',' '), '%Y-%m-%d %H:%M')- timedelta(hours = -offsetHour)

    year = str(sd).split(sep="-")[0]
    month = str(sd).split(sep="-")[1]
    url_month = str(year)+str(month)

    year2 = str(ed).split(sep="-")[0]
    month2 = str(ed).split(sep="-")[1]
    url_month2 = str(year2)+str(month2)

    url = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=1000&page=1&month='+url_month+''
    url2 = 'https://ubcloud.ubutel.eu/api/v2/pbx/loadCdr?order=-calldate&limit=1000&page=1&month='+url_month2+''

    data ={'filters':{'direction':{"incoming":True,"outgoing":True,"internal":False},'callstatus':{"answered":True,"notAnswered":True}}}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'Content-Type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.get(url, headers=headers, data=data)
    response2 = requests.get(url2, headers=headers, data=data)

    l = json.loads(response.text)
    k = json.loads(response2.text)
    
    processed_data = []
    for d in l['data']:
        calldate_date = datetime.strptime(d['calldate'], '%Y-%m-%d %H:%M:%S')
        initDate = datetime.strptime(str(sd), '%Y-%m-%d %H:%M:%S')
        endDate = datetime.strptime(str(ed), '%Y-%m-%d %H:%M:%S')

        if d['src_extension'] == ext:
            if d['direction'] == 'outgoing':
                if int(d['duration']) > 4:
                    if calldate_date > initDate and calldate_date < endDate:
                        processed_data.append({'seconds':int(d['duration']), 'date':datetime.strptime(d['calldate'], '%Y-%m-%d %H:%M:%S'), 'destination':int(d['destination']), 'customer':'', 'codigo':''})
        
    if month != month2:
        for w in k['data']:
            calldate_date = datetime.strptime(w['calldate'], '%Y-%m-%d %H:%M:%S')
            initDate = datetime.strptime(str(sd), '%Y-%m-%d %H:%M:%S')
            endDate = datetime.strptime(str(ed), '%Y-%m-%d %H:%M:%S')

            if w['src_extension'] == ext:
                if w['direction'] == 'outgoing':
                    if int(w['duration']) > 4:
                        if calldate_date > initDate and calldate_date < endDate:
                            processed_data.append({'seconds':int(w['duration']), 'date':datetime.strptime(w['calldate'], '%Y-%m-%d %H:%M:%S'), 'destination':int(w['destination']), 'customer':'', 'codigo':''})

    n = 0
    for pd in processed_data:
        sec_aux = str(pd['seconds']%60)

        if len(sec_aux) == 1:
            sec_aux = '0' + sec_aux

        processed_data[n]['seconds'] = str(int(pd['seconds']/60))+':'+sec_aux

        hour_complete = str(int((str(processed_data[n]['date']).split(sep=" ")[1]).split(sep=":")[0])+1)
        if int(hour_complete) < 10:
            hour_complete = '0'+str(hour_complete)
        processed_data[n]['date'] = str(processed_data[n]['date']).split(sep=" ")[0]+' '+hour_complete+':'+(str(processed_data[n]['date']).split(sep=" ")[1]).split(sep=":")[1]

        customer = Contacts.objects.raw("SELECT dashboard_contacts.* FROM dashboard_contacts WHERE dashboard_contacts.tel LIKE '%%"+str(pd['destination'])+"%%'")
        if customer:
            processed_data[n]['customer'] = customer[0].name
            processed_data[n]['codigo'] = customer[0].ADN_code
        else:
            processed_data[n]['customer'] = '-'
            processed_data[n]['codigo'] = '-'

        n = n+1

    return json.dumps(processed_data)


def callsReport(request):
    # Solicitar certificado de utenticación
    if request.user.is_authenticated:
        # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        company = ca.company_id
        profile = ca.user_profile
        cmp_user_id = ca.company_user_id

        today = datetime.today().strftime('%Y-%m-%d')

        # Si esta funcion es de esta empresa

        functions_company = Function.objects.raw("SELECT * FROM dashboard_function where id= 31")[0]

        if(functions_company.company_id == company):

            # Consultamos los permisos que tiene para esta sección

            if(cmp_user_id != 1):
                permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 31")[0]
            else:
                permissions = "main_admin"

            #Detectar petición de datos
            if request.POST.get('action') == 'get_data':
                s_date= request.POST.get('s_date')
                e_date= request.POST.get('e_date')

                return HttpResponse(getComercialCallsByDate(s_date, e_date, company))

            if request.POST.get('action') == 'mk_call':
                return HttpResponse(makeCall)

            if request.POST.get('action') == 'get_specific_data':
                s_date= request.POST.get('s_date')
                e_date= request.POST.get('e_date')
                ext= request.POST.get('ext')
                return HttpResponse(getSpecificData(s_date, e_date, ext))

            if(cmp_user_id != 1):

                # Consultar si el usuario tiene acceso a la sección de la web
                if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                    return render(request, "salesCalls/salesCalls.html", {'permissions': permissions, 'today':today, 'role':ca.role}) 

                else:
                    return render(request, 'accessDenied/accessDenied.html')

            else:
                return render(request, "salesCalls/salesCalls.html", {'permissions': permissions, 'today':today, 'role':ca.role}) 
        else:
            return render(request, 'accessDenied/accessDenied.html')
    
    # En otro caso redireccionamos al login
    else:
        return redirect('/login') 

def makeCall(src,dst):
    url = 'https://ubcloud.ubutel.eu/api/v2/manager/call'

    data ={"company":"20193", "type":"user", "extension":src, "destination":dst}
    bearer = getTokenUbunet()
    bearer = json.loads(bearer)
    bearer = bearer['access_token']
    headers={'content-type':'application/json','Authorization': 'Bearer '+bearer}

    response = requests.request("POST", url, headers=headers, data=json.dumps(data))
    return response.text