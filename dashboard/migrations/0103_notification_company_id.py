# Generated by Django 3.1.2 on 2021-03-02 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0102_invitation_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='company_id',
            field=models.IntegerField(default=0),
        ),
    ]