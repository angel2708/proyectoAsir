# Generated by Django 3.2.4 on 2021-10-19 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0263_contacts_main_cp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contacts',
            name='main_cp',
        ),
        migrations.AddField(
            model_name='contacts',
            name='main_pc',
            field=models.CharField(max_length=30, null=True),
        ),
    ]