# Generated by Django 3.2.4 on 2021-07-02 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0210_auto_20210702_1719'),
    ]

    operations = [
        migrations.AddField(
            model_name='tracking',
            name='preocessed_packages',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tracking',
            name='number_of_packages',
            field=models.IntegerField(),
        ),
    ]
