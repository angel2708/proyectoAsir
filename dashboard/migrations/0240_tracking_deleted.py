# Generated by Django 3.2.4 on 2021-08-27 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0239_tracking_manual'),
    ]

    operations = [
        migrations.AddField(
            model_name='tracking',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]