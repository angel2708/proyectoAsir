# Generated by Django 3.1.2 on 2021-05-18 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0168_visit_worker_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='compatibleModels',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigoAdn', models.CharField(max_length=100, null=True)),
                ('idArtAdn', models.CharField(max_length=100, null=True)),
                ('tituloAdn', models.CharField(max_length=100, null=True)),
                ('descripcionCorta', models.CharField(max_length=100, null=True)),
                ('descripcionLarga', models.CharField(max_length=100, null=True)),
                ('duplicar', models.CharField(max_length=1000, null=True)),
                ('compatibleModelo', models.CharField(max_length=1000, null=True)),
                ('compatibleCodigo', models.CharField(max_length=1000, null=True)),
                ('idImage', models.CharField(max_length=100, null=True)),
                ('urlImage', models.CharField(max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=False)),
            ],
        ),
    ]
