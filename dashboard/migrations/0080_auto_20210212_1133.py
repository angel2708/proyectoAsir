# Generated by Django 3.1.2 on 2021-02-12 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0079_account_vacation_days'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contacts',
            name='last_visit_date',
        ),
        migrations.RemoveField(
            model_name='contacts',
            name='visits',
        ),
        migrations.AddField(
            model_name='contacts',
            name='tracking_id',
            field=models.IntegerField(null=True),
        ),
    ]
