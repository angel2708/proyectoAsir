# Generated by Django 3.1.2 on 2021-07-30 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0227_auto_20210728_1134'),
    ]

    operations = [
        migrations.AddField(
            model_name='satentry',
            name='changed_state',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='satentry',
            name='encrypted_id',
            field=models.IntegerField(null=True),
        ),
    ]