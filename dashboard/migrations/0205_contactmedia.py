# Generated by Django 3.1.2 on 2021-06-22 09:49

import dashboard.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0204_notification_metadata'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactMedia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contact_id', models.IntegerField()),
                ('doc_name', models.CharField(max_length=150)),
                ('doc_ext', models.CharField(max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('resource', models.FileField(null=True)),
            ],
        ),
    ]
