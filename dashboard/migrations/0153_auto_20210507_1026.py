# Generated by Django 3.1.7 on 2021-05-07 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0152_auto_20210506_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contacts',
            name='fax',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='mail',
            field=models.CharField(blank=True, max_length=350, null=True),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='tel',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='web',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
