"""
Django settings for repository project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import environ
import os
import simplejson
from slacker import Slacker

from django.utils.translation import ugettext_lazy as _
from django.contrib import messages

from config.t47_dev import *
# SECURITY WARNING: don't run with debug turned on in production!
TEMPLATE_DEBUG = DEBUG = T47_DEV

root = environ.Path(os.path.dirname(os.path.dirname(__file__)))
MEDIA_ROOT = root()
# MEDIA_ROOT = os.path.join(os.path.abspath("."))
FILEMANAGER_STATIC_ROOT = root('media/admin') + '/'

env = environ.Env(DEBUG=DEBUG,) # set default values and casting
environ.Env.read_env('%s/config/env.conf' % MEDIA_ROOT) # reading .env file

ALLOWED_HOSTS = env('ALLOWED_HOSTS')
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')


# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = ''
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = '' # MEDIA_ROOT + '/media/'
STATICFILES_DIRS = (root('data'), root('media'))

env_oauth = simplejson.load(open('%s/config/oauth.conf' % MEDIA_ROOT))
AWS = env_oauth['AWS']
GA = env_oauth['GA']
GCAL = env_oauth['CALENDAR']
DRIVE = env_oauth['DRIVE']
GIT = env_oauth['GIT']
SLACK = env_oauth['SLACK']
SLACK['ADMIN_NAME'] = '@' + SLACK['ADMIN_NAME']
DROPBOX = env_oauth['DROPBOX']
APACHE_ROOT = '/var/www'


MANAGERS = ADMINS = (
    (env('ADMIN_NAME'), env('ADMIN_EMAIL')),
)
EMAIL_NOTIFY = env('ADMIN_EMAIL')
(EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_USE_TLS, EMAIL_PORT, EMAIL_HOST) = [v for k, v in env.email_url().items() if k in ['EMAIL_HOST_PASSWORD', 'EMAIL_HOST_USER', 'EMAIL_USE_TLS', 'EMAIL_PORT', 'EMAIL_HOST']]
EMAIL_SUBJECT_PREFIX = '[Django] {daslab.stanford.edu}'

ROOT_URLCONF = 'src.urls'
WSGI_APPLICATION = 'src.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
DATABASES = {'default': env.db_url(), }
LOGIN_URL = '/signin/'

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
TIME_ZONE = 'America/Los_Angeles'
LANGUAGE_CODE = 'en-us'
LANGUAGES = (
    ('en', _('English')),
)
SITE_ID = 1

USE_I18N = True
USE_L10N = True
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/"
from src.path import *
from src.auth import *
GROUP = USER_GROUP()
PATH = SYS_PATH()


env_cron = simplejson.load(open('%s/config/cron.conf' % MEDIA_ROOT))
#     os.getlogin()
CRONJOBS = env_cron['CRONJOBS'][0:2]
CRONTAB_LOCK_JOBS = env_cron['CRONTAB_LOCK_JOBS']
KEEP_BACKUP = env_cron['KEEP_BACKUP']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '%s/cache/log_django.log' % MEDIA_ROOT,
        },
    },
    'loggers': {
        'django_crontab.crontab': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
        'django': {
            'handlers': ['file'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        }
    },
}

class ExceptionUserInfoMiddleware(object):
    def process_exception(self, request, exception):
        try:
            if request.user.is_authenticated():
                request.META['USERNAME'] = str(request.user.username)
                request.META['USER_EMAIL'] = str(request.user.email)
        except:
            pass


# Application definition
INSTALLED_APPS = (
    # 'sslserver',
    'django_crontab',

    'filemanager',
    'adminplus',
    'suit',
    # 'bootstrap_admin',
    # 'django_admin_bootstrapped',
    'django.contrib.admin.apps.SimpleAdminConfig',
    # 'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # 'django.contrib.sites',
    'django.contrib.staticfiles',
    'django.contrib.humanize',

    'src',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.request",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.contrib.messages.context_processors.messages",

    "src.models.email_form",
    "src.models.debug_flag",
)

MIDDLEWARE_CLASSES = (
    'src.settings.ExceptionUserInfoMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'src.auth.AutomaticAdminLoginMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)
TEMPLATE_DIRS = (
    root('media'),
    root(),
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)


SUIT_CONFIG = {
    # header
    'ADMIN_NAME': 'Das Lab Website',
    'HEADER_DATE_FORMAT': 'F d, Y (l)',
    'HEADER_TIME_FORMAT': 'h:i a (e)',

    # forms
    'SHOW_REQUIRED_ASTERISK': True,  # Default True
    'CONFIRM_UNSAVED_CHANGES': True, # Default True

    # menu
    # 'SEARCH_URL': '/admin/auth/user/',
    'MENU_OPEN_FIRST_CHILD': True, # Default True
    'MENU': (),

    # misc
    'LIST_PER_PAGE': 25
}

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_HOST = env('SSL_HOST')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
CSRF_COOKIE_SECURE = True
