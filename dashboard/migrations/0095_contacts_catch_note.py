# Generated by Django 3.1.2 on 2021-02-22 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0094_address_codigo_dir_cliente'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacts',
            name='catch_note',
            field=models.TextField(blank=True),
        ),
    ]