# Generated by Django 3.1.2 on 2021-04-12 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0136_remove_testingtemplate_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='PhoneListTesting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_ref', models.CharField(max_length=100)),
                ('phone_desc', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='phonetesting',
            name='phone_id',
            field=models.IntegerField(null=True),
        ),
    ]