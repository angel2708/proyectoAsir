from django.core.management.base import BaseCommand, CommandError
from dashboard.models import Account, Companies
from django.conf import settings
from django.db import connection

from django.template.loader import render_to_string
from django.conf import settings

from django.core.mail import EmailMultiAlternatives, EmailMessage

# Cambio de año 

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

class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            companies = Companies.objects.raw('SELECT * FROM dashboard_companies WHERE active = true')
            users = Account.objects.raw('SELECT * FROM dashboard_account WHERE dashboard_account.is_active = TRUE')
            for i in range(len(users)):
                users[i].pending_days = companies[0].vacation_days - users[i].vacation_days #Calculamos pendientes dias laborables
                users[i].vacation_days = users[i].vacation_days_next #Cambiamos usados de año siguiente a actual
                users[i].vacation_days_next = 0 #Ponemos usados de año siguient a 0
                users[i].pending_days += ((users[i].pending_days // 5)*2) #Cambiamos pendientes de dias laborables a naturales // Eliminar despues de ejecutarla
                users[i].save()

            companies[0].vacation_days = 32 #Cambiamos dias de vacaciones a dias naturales // Eliminar despues de ejecutar
            companies[0].save()
            return 'ok'
        except:
            host = 'https://gestion.esmovil.es'
            subject = "Error en la tarea - Cambio de año"
            template_name = "mailing/taskError.html"
            mail = create_mail('juanfran.rodriguez@esmovil.es', subject, template_name, {'host':host, 'issue':'Cambio de año'})
            mail.send(fail_silently=False)
            return 'error'