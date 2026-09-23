# Generated manually to keep the service schema aligned with its REST contract.
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('empresas', '0002_company_delete_usuario')]

    operations = [
        migrations.AddField(
            model_name='company',
            name='sector',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
