# Generated by Django 3.1.2 on 2021-02-03 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0059_remove_visit_regular_suppliers'),
    ]

    operations = [
        migrations.AddField(
            model_name='visit',
            name='request_observations',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
