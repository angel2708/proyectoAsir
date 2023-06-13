from django.core.management.base import BaseCommand, CommandError
from dashboard.models import CheckInData
import urllib
from django.conf import settings
from django.db import connection
import shutil, os
import json
import requests
from django.utils.timezone import utc
from datetime import datetime, timedelta

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives, EmailMessage
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

def isTrue(s):
    if s == 'true' or s == '1' or s == True:
        return True
    else:
        return False


class Command(BaseCommand):  
    def handle(self, *args, **options):
        checkindata = CheckInData.objects.raw('SELECT * FROM dashboard_checkindata WHERE check_in IS NOT NULL AND check_out IS NULL')
        now = datetime.now().replace(tzinfo=utc)
        now_day = str(now).split(sep=' ')[0]

        for i in range(len(checkindata)):
            check_in = checkindata[i].check_in
            check_in_day = str(check_in).split(sep=' ')[0]
            check_in_user = checkindata[i].user

            total = 0
            if now_day != check_in_day:
                slots = CheckInData.objects.raw("SELECT * FROM dashboard_checkindata WHERE dashboard_checkindata.user = "+str(check_in_user)+" AND (dashboard_checkindata.check_in > TO_DATE('"+str(check_in_day)+"', 'YYYY-MM-DD')) AND (check_out IS NOT NULL)")
                
                for j in range(len(slots)):
                    check_out_hours = ((str(slots[j].check_out)).split(sep=" ")[1]).split(sep=":")[0]
                    check_out_minutes = ((str(slots[j].check_out)).split(sep=" ")[1]).split(sep=":")[1]
                    check_in_hours = ((str(slots[j].check_in)).split(sep=" ")[1]).split(sep=":")[0]
                    check_in_minutes = ((str(slots[j].check_in)).split(sep=" ")[1]).split(sep=":")[1]

                    total_hours = int(check_out_hours)-int(check_in_hours)
                    total_minutes = int(check_out_minutes)-int(check_in_minutes)

                    while total_minutes < 0:
                        total_minutes = total_minutes+60
                        total_hours = total_hours-1

                    total = total+int(total_hours*60)+total_minutes

            check_in_hours = ((str(checkindata[i].check_in)).split(sep=" ")[1]).split(sep=":")[0]
            check_in_minutes = ((str(checkindata[i].check_in)).split(sep=" ")[1]).split(sep=":")[1]
            total = 480-total
            if total >= 60:
                th = total/60
                th = str(th).split(sep=".")[0]
            else:
                th = 0

            check_out_hours = int(check_in_hours)+int(th)

            if total >= 0:
                check_out_minutes = int(check_in_minutes)+int(total-(int(th)*60))
            else:
                check_out_minutes = int(check_in_minutes)-int(total-(int(th)*60))

            while check_out_minutes >= 60:
                check_out_minutes = check_out_minutes-60
                check_out_hours = check_out_hours+1

            check_out_hours = check_out_hours+2
            if check_out_hours > 20:
                check_out_hours = 20
                check_out_minutes = 0

            check_out = str(check_in_day)+' '+str(check_out_hours)+':'+str(check_out_minutes)+':00+02'
            checkindata[i].check_out = check_out
            checkindata[i].save()
                
        return 'ok'