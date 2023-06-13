from django import template
from datetime import datetime, timedelta
import json
from django.core import serializers
from django.utils import timezone
import time

register = template.Library()

@register.filter
def addstr(arg1, arg2):
    return str(arg1) + str(arg2)

@register.filter
def split(arg1):
    return arg1.split(',')

@register.filter
def main(arg1):
    if arg1 is not None:
        if arg1.split(',')[0]!='' or len(arg1.split(','))==1:
            return arg1.split(',')[0]
        else:
            return arg1.split(',')[1]

@register.filter
def dateFormat(arg1):
    if arg1 != None:
        return (arg1 + timedelta(hours = 1)).strftime("%Y-%m-%d %H:%M")

@register.filter
def dateFormatNoHour(arg1):
    if arg1 != None:
        return arg1.strftime("%d-%m-%Y")

@register.filter
def dateFormatNoHourOrderable(arg1):
    if arg1 != None:
        return arg1.strftime("%Y-%m%d")

@register.filter
def dateFormatOrderable(arg1):
    if arg1 != None:
        return (arg1 + timedelta(hours = 1)).strftime("%Y/%m/%d - %H:%M")

@register.filter
def dateFormatBudget(arg1):
    if arg1 != None:
        return (arg1 + timedelta(hours = 1)).strftime("%Y/%m/%d - %H:%M")

@register.filter
def dateFormatDeliveryIncidence(arg1):
    if arg1 != None:
        return (arg1)

@register.filter
def dateFormatWebRegister(arg1):
    if arg1 != None:
        return (arg1 + timedelta(hours = 1)).strftime("%Y/%m/%d")

@register.filter
def dateFormatOrderableAdn(arg1):
    if arg1 != None:
        return (arg1 + timedelta(hours = 1)).strftime("%Y/%m/%d - %H:%M")

@register.filter
def csvName(arg1):
    return arg1[:-4]

@register.simple_tag
def splitString(arg,separator,position):
    print(arg)
    print(separator)
    print(position)
    return arg.split(separator)[position]


@register.simple_tag
def getFirstPosition(arg):
    return arg[0]

@register.filter
def callLinks(phones):
    print(phones)
    r=''

    for p in phones.split(','):
        if p != '' and p != ',':
            r = r + '<a tlf-n="'+p+'" class="list-group-item call-trigger" style="padding:10px !important;font-size:16px;"><b>'+p+'</b></a>'

    if r == '':
        r ="Sin datos"

    return r


@register.filter
def trimReferences(arg):
    return arg[4:-4].replace('//**','<br>')


@register.filter
def getElementsJson(json1, data):
    json1 = json.loads(json1)
    data = data.split(',')
    return json1[data[0]][data[1]]