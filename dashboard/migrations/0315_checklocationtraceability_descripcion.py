# Generated by Django 3.2.4 on 2023-02-14 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0314_auto_20230206_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='checklocationtraceability',
            name='descripcion',
            field=models.CharField(max_length=150, null=True),
        ),
    ]