# Generated by Django 3.1.2 on 2021-06-10 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0198_contacts_status_pre_catchment'),
    ]

    operations = [
        migrations.AddField(
            model_name='commercialbudgets',
            name='hidden',
            field=models.BooleanField(default=False),
        ),
    ]