# Generated by Django 3.1.3 on 2021-01-21 23:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0039_auto_20210121_2344'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='email',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]