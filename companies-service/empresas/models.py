from django.db import models


class Company(models.Model):

    id_company = models.AutoField(
        primary_key=True
    )

    nit_company = models.CharField(
        max_length=20,
        unique=True
    )

    nombre_company = models.CharField(
        max_length=100
    )

    correo_company = models.EmailField(
        unique=True
    )

    telefono_company = models.CharField(
        max_length=20,
        blank=True
    )

    sector = models.CharField(
        max_length=100,
        blank=True
    )

    activo = models.IntegerField(
        default=1
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.nombre_company} {self.nit_company}"
