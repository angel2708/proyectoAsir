# Generated by Django 3.1.2 on 2021-05-25 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0187_visit_ending_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacts',
            name='aproved',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='contacts',
            name='particular',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='contacts',
            name='registered',
            field=models.BooleanField(null=True),
        ),
    ]