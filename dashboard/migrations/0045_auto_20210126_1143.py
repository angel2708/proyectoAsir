# Generated by Django 3.1.2 on 2021-01-26 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0044_note_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='color',
            field=models.CharField(max_length=10),
        ),
    ]
