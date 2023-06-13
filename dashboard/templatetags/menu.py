import re
from django import template
from django.urls import reverse, NoReverseMatch

from dashboard.models import Permission, Function, CA, Account

from django.utils.timezone import utc
from datetime import datetime, timedelta

from django.core import serializers

import json

register = template.Library()

@register.simple_tag(takes_context=True)
def active(context, pattern_or_urlname):
    try:
        pattern = '^' + reverse(pattern_or_urlname)
    except NoReverseMatch:
        pattern = pattern_or_urlname
    path = context['request'].path
    if re.search(pattern, path):
        return 'active'
    return ''


# FUNCTIONS MENU

@register.simple_tag(takes_context=True)
def functions_company(context, function):
    
    ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
    company_id = ca.company_id

    functions = Function.objects.raw("SELECT * FROM dashboard_function where id= "+str(function))[0]

    if functions.company_id == company_id:
        return True
    else:
        return False

# PERMISSION MENU

@register.simple_tag(takes_context=True)
def permission(context, function):
    ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=True)
    ca=ca[0]
    user_profile = ca.user_profile

    if function != "15":
        if user_profile != 0:
            permissions = Permission.objects.raw("SELECT * FROM dashboard_permission where profile_id = "+str(user_profile)+" AND function_id = "+function+" ORDER BY id ASC")

            if len(permissions) > 0:
                permissions = permissions[0]
                if(permissions.consult or permissions.create or permissions.delete or permissions.edit):
                    return True
                else:
                    return False
            else:
                return False
        else:
            return True
    else:
        if user_profile != 0:
            return False
        else:
            return True

@register.simple_tag(takes_context=True)
def get_company(context):
    
    ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
    
    return ca.company_id

@register.simple_tag(takes_context=True)
def get_username(context):
    
    user = Account.objects.get(pk=context['request'].user.id)
    
    return user.first_name

@register.simple_tag(takes_context=True)
def get_role(context):
    
    ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
    
    return ca.role

@register.simple_tag(takes_context=True)
def get_user(context):
    
    user = Account.objects.get(pk=context['request'].user.id)
    
    return user.id

@register.simple_tag(takes_context=True)
def get_obj_all(context):

    try:
        ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
        if ca.role == 2 and ca.user_id != 15:
            user = Account.objects.get(pk=context['request'].user.id)
            rep_id = user.rep_id
            rep_id = str(rep_id)
  
            for i in range(5):
                if len(rep_id) < 5:
                    rep_id = '0'+rep_id

            all = json.loads(all.text)

            return all[0]
    except:
        return []

@register.simple_tag(takes_context=True)
def get_active_clients(context):

    try:
        ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
        if ca.role == 2 and ca.user_id != 15:
            user = Account.objects.get(pk=context['request'].user.id)
            rep_id = user.rep_id
            rep_id = str(rep_id)
                
            for i in range(5):
                if len(rep_id) < 5:
                    rep_id = '0'+rep_id
            
            act = json.loads(act.text)

            return act[0]
    except:
        return []