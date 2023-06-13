from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import os

from django.db.models.fields import CharField, TextField

#GESTOR DE CUENTAS
class MyAccountManager(BaseUserManager):
    """
    Gestor de cuentas usado para el modelo personalizado de autenticación.
    """
    def create_user(self, email, password, first_name, last_name,owner=0):
        if not email:
        	raise ValueError('Users must have an email address')
        if not first_name:
        	raise ValueError('Users must have a first name')
        if not last_name:
        	raise ValueError('Users must have a last name')

        user = self.model(
            email=self.normalize_email(email),
            password=password,
            first_name = first_name,
            last_name = last_name,
            owner = owner,
            verified = False
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            first_name = first_name,
            last_name = last_name,
            owner=0,
        )
        user.verified = True
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

#CUENTA DE USUARIO PERSONALIZADA
class Account(AbstractBaseUser):
    """
    Modelo personalizado para la autenticación de usuario.
    """
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    removed = models.BooleanField(default=0)
    first_name = models.CharField(max_length=100, default='')
    last_name = models.CharField(max_length=100, default='')
    vacation_days = models.IntegerField(default=0)
    vacation_days_next = models.IntegerField(default=0)
    rep_id = models.IntegerField(null=True)
    owner = models.IntegerField(null=True)
    verified = models.BooleanField(default=0)
    avatar = models.ImageField(null=True, upload_to='dashboard/media/board/')
    pending_days = models.IntegerField(default=0)
    email_pass = models.TextField(null=True)
    signature = models.TextField(null=True)
    work_hours = models.IntegerField(null=True, default=8)
    adn_name = models.CharField(max_length=30, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    # Preguntar permisos
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Preguntar permisos para APP
    def has_module_perms(self, app_label):
        return True

#CUENTA DE USUARIO DE EMPRESA
class DomainKey(models.Model):
    """
    Identificador de dominio
    """
    key = models.ImageField()

#CUENTA DE USUARIO DE EMPRESA
class CA(models.Model):
    """
    Relación entre cuentas y múltiples compañias
    """
    user_id = models.IntegerField(default=0)
    company_id = models.IntegerField(default=0)
    company_user_id = models.IntegerField(default=0)
    departament_id = models.IntegerField(default=0)
    user_profile = models.IntegerField(default=0)
    role = models.IntegerField(default=0)
    on_use = models.BooleanField(default=False)
    enabled = models.BooleanField(default=True)
    company_admin = models.BooleanField(default=False)
    partner = models.BooleanField(default=False)
    phone = models.CharField(blank=True, max_length=20, null = True)
    mirror = models.IntegerField(default=0)

class Invitation(models.Model):
    """
    Invitaciones de usuarios a una empresa
    """
    email = models.EmailField(max_length=60)
    user_id = models.IntegerField(default=0)
    owner = models.IntegerField(default=0)
    user_id = models.IntegerField(default=0)
    aproved = models.BooleanField(default=False)
    state = models.IntegerField(default=1)
    company_id = models.IntegerField(default=0)
    departament_id = models.IntegerField(default=0)
    company_id = models.IntegerField(default=0)
    user_profile = models.IntegerField(default=0)
    company_id = models.IntegerField(default=0)
    verification_url = models.TextField(blank=True)
    role = models.IntegerField(default=0)
    phone = models.CharField(blank=True, max_length=20)


class Companies(models.Model):

    """
    Compañias registradas en la aplicación.
    """
    name = models.CharField(max_length=150)
    active = models.BooleanField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    removed = models.BooleanField(default=0)
    vacation_days = models.IntegerField(default=23)
    check_config = models.BooleanField(default=False)
    min_vacations = models.IntegerField(null=False, default=1)
    max_vacations = models.IntegerField(null=False, default=5)
    start_day = models.IntegerField(null=False, default=1)
    end_day = models.IntegerField(null=False, default=5)
    vacations_range = models.BooleanField(default=False)
    logo = models.ImageField(null=True, upload_to='company_logo/')

class Incidences(models.Model):
    """
    Incidencias internas de la empresa.
    """
    user_id = models.IntegerField(null=True)
    company_id = models.IntegerField(null=True)
    source_departament_id = models.IntegerField(null=True)
    destination_departament_id = models.IntegerField(null=True)
    priority = models.IntegerField(null=True)
    issue = models.CharField(max_length=80, null=True)
    description = models.TextField(blank=True,null=True)
    state = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    removed =  models.BooleanField(default=False)
    checked = models.BooleanField(default=False)
    boss_only = models.BooleanField(default=False)
    has_media = models.BooleanField(default=False)
    note = models.CharField(max_length=200, null=True)
    assigned = models.IntegerField(null=True)


class IncidencesMedia(models.Model):
    """
    Tabla para las imagenes de las incidencias
    """
    def get_path(instance, filename):
        return 'incidence/order_{0}/{1}'.format(instance.incidence, filename)
    

    incidence = models.IntegerField()
    incidence_img = models.ImageField(null=False, upload_to=get_path)


class Function(models.Model):
    """
    Funciones de la aplicación para las distintas empresas.
    """
    company_id = models.IntegerField()
    name = models.CharField(max_length=100)
    parent = models.IntegerField(default=0)
    has_child = models.BooleanField(default=0)
    level = models.IntegerField(default=0)
    block_number = models.IntegerField(default=0)
    block_position = models.IntegerField(default=0)


class Profile(models.Model):
    """
    Perfiles asociados a las distintas empresas.
    """
    company_id = models.IntegerField()
    departament_id = models.IntegerField(default=0)
    name = models.CharField(max_length=100)

class Permission(models.Model):
    """
    Funciones habilitadas para los distintos perfiles.
    """
    profile_id = models.IntegerField()
    function_id = models.IntegerField()
    create = models.BooleanField(default=False)
    edit = models.BooleanField(default=False)
    consult = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)

class Departament(models.Model):
    """
    Departamento interno de la empresa.
    """
    company_id = models.IntegerField()
    name = models.CharField(max_length=100)
    manager = models.IntegerField(default = 0)

class Role(models.Model):
    """
    Roles asignados a los usuarios
    """
    company_id = models.IntegerField(null=True)
    name = models.CharField(max_length=100)

class Language(models.Model):
    """
    Modelo de lenguajes
    """
    name = models.CharField(max_length=100)
 
class Commentaries(models.Model):
    """
    Comentarios sobre las incidencias.
    """
    commentator = models.IntegerField(null=False)
    company_id = models.IntegerField(null=False)
    inc_id = models.IntegerField(null=False)
    content = models.CharField(null=True,max_length=400)
    date = models.CharField(null=True,max_length=25)

class CheckInData(models.Model):
    """
    Tabla para almacenar los fichajes de los empleados
    """
    user = models.IntegerField(null=False)
    check_in = models.DateTimeField(auto_now_add=True, null=False)
    check_out = models.DateTimeField(null=True)
    check_in_edited = models.DateTimeField(null=True)
    check_out_edited = models.DateTimeField(null=True)
    aproved = models.BooleanField(default=0)
    deleted = models.BooleanField(default=0)
    device_in = models.IntegerField(null=True)
    device_out = models.IntegerField(null=True)
    manually = models.BooleanField(null=True, default=0)
    company_id = models.IntegerField(null=True, default=1)

class Absence(models.Model):
    """
    Tabla para almacenar las ausencias de los trabajadores
    """
    user = models.IntegerField(null=False)
    departament = models.IntegerField(null=False)
    absence_type = models.IntegerField(null=False, default=0)
    description = models.CharField(max_length=200, null=True)
    start = models.DateField(null=False)
    finish = models.DateField(null=False)
    state = models.IntegerField(null=False, default=0)
    deleted = models.IntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    company_id = models.IntegerField(null=True, default=1)

class AbsenceMedia(models.Model):
    """
    Tabla para los documentos de las ausencias
    """
    def get_path(instance, filename):
        return 'absence/order_{0}/{1}'.format(instance.absence_id, filename)
    
    absence_id = models.IntegerField()
    file = models.FileField(null=False, upload_to=get_path)