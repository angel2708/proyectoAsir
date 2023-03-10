# Generated by Django 3.1.2 on 2021-04-08 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0132_auto_20210408_1751'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendar',
            name='removed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='calendar',
            name='state',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='testingreport',
            name='rma_percentage',
            field=models.FloatField(default=0),
        ),
    ]
