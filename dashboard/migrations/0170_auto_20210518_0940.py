# Generated by Django 3.1.2 on 2021-05-18 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0169_contacts_last_visit_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='visit_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='worker_number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]