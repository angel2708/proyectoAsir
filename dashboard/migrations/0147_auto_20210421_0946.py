# Generated by Django 3.1.2 on 2021-04-21 07:46

import dashboard.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0146_auto_20210419_1207'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentTestingEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doc_ref', models.CharField(max_length=100)),
                ('s_ref', models.CharField(max_length=100)),
                ('id_doc', models.CharField(max_length=100)),
                ('rma', models.FloatField()),
                ('observation', models.TextField()),
                ('state', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='parttestingmedia',
            name='resource',
            field=models.FileField(null=True, upload_to=dashboard.models.PartTestingMedia.get_path),
        ),
        migrations.AlterField(
            model_name='phonetestingmedia',
            name='resource',
            field=models.FileField(null=True, upload_to=dashboard.models.PhoneTestingMedia.get_path),
        ),
    ]
