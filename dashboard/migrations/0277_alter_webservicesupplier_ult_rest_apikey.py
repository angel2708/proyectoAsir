# Generated by Django 3.2.7 on 2022-04-18 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0276_alter_webservicesupplier_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webservicesupplier',
            name='ult_rest_apikey',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
