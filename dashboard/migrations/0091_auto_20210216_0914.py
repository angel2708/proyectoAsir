# Generated by Django 3.1.2 on 2021-02-16 08:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0090_contacts_rep_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contacts',
            name='rep_id',
        ),
        migrations.AddField(
            model_name='account',
            name='rep_id',
            field=models.IntegerField(null=True),
        ),
    ]
