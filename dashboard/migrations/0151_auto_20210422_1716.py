# Generated by Django 3.1.2 on 2021-04-22 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0150_documenttestingentry_supplier'),
    ]

    operations = [
        migrations.AddField(
            model_name='documenttestingentry',
            name='tested_q',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='documenttestingentry',
            name='valid_q',
            field=models.IntegerField(null=True),
        ),
    ]