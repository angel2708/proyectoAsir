# Generated by Django 3.1.7 on 2021-05-11 17:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0161_auto_20210511_1848'),
    ]

    operations = [
        migrations.RenameField(
            model_name='carrierincidence',
            old_name='incidende_date',
            new_name='incidence_date',
        ),
    ]
