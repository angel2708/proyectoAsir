# Generated by Django 3.1.2 on 2021-08-20 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0235_temporalproductsadn_company_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='temporalproductsadn',
            name='refused',
            field=models.BooleanField(default=False),
        ),
    ]
