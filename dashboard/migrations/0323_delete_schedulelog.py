# Generated by Django 4.1.2 on 2023-03-25 13:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0322_delete_category_delete_categorylang'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ScheduleLog',
        ),
    ]
