"""
Django settings for G project.

Generated by 'django-admin startproject' using Django 3.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os.path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'm0&s0=opp7dk-!jbsx%j8%^s$ex@_wxiaw$+ym+1^(_ti7nmhf'

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = False
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'proyectoasir.ddns.net', '192.168.1.97']
#ALLOWED_HOSTS = ['161.22.44.32']
#ALLOWED_HOSTS = ['161.22.43.152', 'localhost', 'django', '127.0.0.1']

#ALLOWED_HOSTS = ['192.168.10.18']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admindocs',
    'dashboard',
    'jquery_ui',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.admindocs.middleware.XViewMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',
]

ROOT_URLCONF = 'G.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_USER_MODEL = 'dashboard.Account'

WSGI_APPLICATION = 'G.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases


"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

"""

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "glocal",
        "USER": "postgres",
        "PASSWORD": "usuario",
        "HOST": "192.168.99.129",
        "PORT": "30653",
    }
}

##################################################################################################
##################################################################################################
##################################################################################################
##################################################################################################

#ATENCION!!
#BASE DE DATOS REAL

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql_psycopg2",
#         "NAME": "g_",
#         "USER": "idioscar",
#         "PASSWORD": "KnJhaQuenS",
#         "HOST": "161.22.43.11",
#         "PORT": "5432",
#     }
# }

##################################################################################################
##################################################################################################
##################################################################################################
##################################################################################################




# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Madrid'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/dashboard/staticfiles/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "dashboard/staticfiles"),
]

EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp-mail.outlook.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = "proyectoangelcv@outlook.es"
EMAIL_HOST_PASSWORD = "958450450Proyecto"
EMAIL_INCIDENCES_USER = "incidencias@esmovil.es"
EMAIL_INCIDENCES_PASSWORD = "$_Esmovil_$Incidencias_"
EMAIL_DELIVERY_USER="sonia.fernandez@esmovil.es"
EMAIL_DELIVERY_PASSWORD="$_Sonia$_2019"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

MEDIA_URL = '/dashboard/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'dashboard/media')

DBBACKUP_STORAGE = 'django.core.files.storage.FileSystemStorage'
DBBACKUP_STORAGE_OPTIONS = {'location': BASE_DIR / 'backup'}

CORS_ALLOWED_ORIGINS = [
    "https://prueba.esmovil.es"
]