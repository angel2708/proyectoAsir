# Generated by Django 3.1.2 on 2021-01-03 22:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email')),
                ('username', models.CharField(max_length=30, unique=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='date joined')),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='last login')),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Companies',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('active', models.BooleanField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('removed', models.BooleanField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Contacts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.PositiveIntegerField(default=1, help_text='Prueba de la descripcion de columna')),
                ('company_contact_id', models.PositiveIntegerField(default=0)),
                ('rep_id', models.IntegerField(default=0)),
                ('name', models.CharField(max_length=100)),
                ('mail', models.CharField(max_length=50)),
                ('tel', models.CharField(max_length=30)),
                ('web', models.CharField(max_length=50)),
                ('client_type', models.IntegerField(default=0)),
                ('user_type', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('removed', models.BooleanField(default=0)),
                ('favorite', models.BooleanField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Functions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.PositiveIntegerField()),
                ('profile_id', models.PositiveIntegerField()),
                ('function_id', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Incidences',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.PositiveIntegerField()),
                ('client_id', models.IntegerField(default=0)),
                ('rep_id', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=200)),
                ('state', models.IntegerField(default=0)),
                ('deadline', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('removed', models.BooleanField(default=0)),
                ('favorite', models.BooleanField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Profiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.PositiveIntegerField()),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Restrictions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_id', models.PositiveIntegerField()),
                ('function_id', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('company_id', models.IntegerField()),
                ('company_user_id', models.PositiveIntegerField()),
                ('user_profile', models.IntegerField(default=0)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('removed', models.BooleanField(default=0)),
            ],
        ),
    ]
