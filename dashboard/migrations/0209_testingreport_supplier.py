# Generated by Django 3.2.4 on 2021-07-01 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0208_remove_testingtemplate_supplier'),
    ]

    operations = [
        migrations.AddField(
            model_name='testingreport',
            name='supplier',
            field=models.IntegerField(null=True),
        ),
    ]