# Generated by Django 3.2.7 on 2022-06-02 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0287_proposalmedia_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='response_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='proposal',
            name='sales_proposal',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
