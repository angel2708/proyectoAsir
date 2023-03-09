from django.shortcuts import render, HttpResponse, redirect
from dashboard.models import  Companies
from django.core import serializers
from django.http import JsonResponse
from django.contrib import messages
from django.db import connection
import json
from dashboard.models import Companies, CA, Permission, Function

from django.contrib.auth.models import User

from dashboard.functions import functions

from dashboard.forms import companyLogo

def companiesManagement(request):
    # Solicitar certificado de utenticación
    if request.user.is_authenticated:
       # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        cmp_user_id = ca.company_user_id
        company = ca.company_id
        profile = ca.user_profile

        companies = CA.objects.filter(company_user_id=1)

        cmp_list = ''

        for c in companies:
            cmp_list = cmp_list + str(c.company_id) + ','

        cmp_list = cmp_list[:-1]

        companies = Companies.objects.raw('SELECT COUNT(company_id) AS user_number, MAX(dashboard_companies.id) as id, MAX(dashboard_companies.name) as name, MAX(dashboard_companies.created_at) as created_at FROM dashboard_companies JOIN dashboard_ca ON dashboard_ca.company_id = dashboard_companies.id WHERE dashboard_ca.company_id IN ('+cmp_list+') GROUP BY dashboard_ca.company_id ORDER BY MAX(dashboard_companies.id) ASC')

        if(cmp_user_id != 1):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 15")[0]
        else:
            permissions = "main_admin"

        #Procesamiento de peticiones

        #Actualizar los datos con logo
        if request.POST.get('action') == 'update_company':
            ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
            company = request.POST.get('id')
            user_id = ca.id
            profile = ca.user_profile
            cmp_user_id = ca.company_user_id
            company = Companies.objects.get(pk = company)
            company.name = request.POST.get('name')
            

            company.save()
            return HttpResponse('ok')

        #Creación de compañía
        if request.POST.get('action') == 'create_company' and cmp_user_id == 1:
            company_name = request.POST.get('company_name')

            company_obj = Companies.objects.create(
                name = company_name
            )  

            CA.objects.create(
                company_id = company_obj.id,
                company_user_id = 1,
                user_profile = 0,
                departament_id = 0,
                role = 0,
                on_use=False,
                user_id= ca.user_id
            ) 

            return HttpResponse(company_obj.id, 'ok')

        if(cmp_user_id != 1):
            # Consultar si el usuario tiene acceso a la sección de la web
            if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                # Dar acceso a la sección de la web
                return render(request, 'companiesManagement/companiesManagement.html', {'permissions': permissions, 'companies':companies})  
            else:
                # Mostrar pantalla de acceso denegado
                return render(request, 'accessDenied/accessDenied.html')
        else:
            return render(request, 'companiesManagement/companiesManagement.html', {'permissions': permissions, 'companies':companies})  
        
    # En otro caso redireccionamos al login
    else:
        return redirect('/login') 

def companySettings(request):
    # Solicitar certificado de utenticación
    if request.user.is_authenticated:

        # Consulta de los datos de la sesión
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        company = ca.company_id
        user_id = ca.id
        profile = ca.user_profile
        cmp_user_id = ca.company_user_id
    
        company = Companies.objects.get(pk = company)
        #Establecemos el avatar
        avatar = ((company.name)[0] + (company.name)[1])
        #Actualizar los datos
        if request.POST.get('action') == 'update_company':
            # print(request.method)
            ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
            company = ca.company_id
            user_id = ca.id
            profile = ca.user_profile
            cmp_user_id = ca.company_user_id
            company = Companies.objects.get(pk = company)
            company.name = request.POST.get('name')
            # company.logo = "./company-logo/"+request.POST.get('logo')
            # company.logo = request.FILES.get('logo')


            company.save()
            return HttpResponse('ok')

        #Añadimos el logo de la empresa mediante un form.py
        if request.method == 'POST':
            # print('entra 1')
            form = companyLogo(request.POST, request.FILES, instance = company)
            if form.is_valid():
                # file is saved
                form.save()
                # return HttpResponse('Ok')
        else:
            form = companyLogo()
        

        if(cmp_user_id != 1):
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission WHERE profile_id = " + str(profile) + " AND function_id = 15")[0]
        else:
            permissions = "main_admin"

        # En otro caso redireccionamos al login
    else:
        return redirect('/login') 


    return render(request, 'companySettings/companySettings.html', {'company':company, 'avatar': avatar.upper(), 'permissions': permissions, 'form': form})

def switchCompany(request):
    if request.user.is_authenticated:
        location = request.POST.get('location')
        switch_cmp = request.POST.get('company')
        ca = CA.objects.filter(user_id=request.user.id).filter(on_use=True)[0]
        ca.on_use = False
        ca.save()

        function = request.POST.get('function')

        ca_switch = CA.objects.filter(user_id=request.user.id).filter(company_id=switch_cmp)[0]
        ca_switch.on_use = True
        ca_switch.save()

        print(function)

        f = Function.objects.get(pk=function)

        if f.company_id == 0 or f.company_id == -1 or f.company_id == ca_switch.company_id:
            if f.company_id == -1:
                return HttpResponse('ok')
            else:
                if 'client-edition' in location:
                    return HttpResponse('/')
                elif ca_switch.company_user_id == 1:
                    return HttpResponse('ok')
                else:
                    p = Permission.objects.filter(function_id=function).filter(profile_id=ca_switch.profile_id)

                    if len(p)==0:
                        return HttpResponse('/')
                    elif p[0].consult or p[0].create or p[0].delete or p[0].edit:
                        return HttpResponse('ok')
                    else: 
                        return HttpResponse('/')
        else:
            return HttpResponse('/')

    return HttpResponse('error')
