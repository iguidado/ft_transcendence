#!/bin/sh


# If no venv in directory create it
#

if ! [ -d /app/venv/ ]
then
	python -m venv /app/venv
fi

. /app/venv/bin/activate
# pip install whitenoise
# pip install daphne
python -m pip install --no-cache-dir -r /root/requirements.txt #2> /dev/null

if ! [ -d /app/ft_transcendence ]
then
	mkdir -p /app/ft_transcendence
	django-admin startproject billpong /app/ft_transcendence
fi

if ! [ -d /app/ft_transcendence/media/avatars ]
then
    mkdir -p /app/ft_transcendence/media/avatars
    chmod -R 755 /app/ft_transcendence/media
fi

if ! [ -d /app/ft_transcendence/media/avatars/default1.png ]
then
    cp /app/ft_transcendence/api/static/api/images/default1.png /app/ft_transcendence/media/avatars/
fi

if ! [ -d /app/ft_transcendence/api ]
then
	cd /app/ft_transcendence
	django-admin startapp api
fi

python /app/ft_transcendence/manage.py makemigrations api

python /app/ft_transcendence/manage.py migrate

# sleep 5

python /app/ft_transcendence/manage.py shell <<EOF
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billpong.settings')
django.setup()

from api.models import User

USERNAME = os.getenv('ADMIN_USER')
PASSWORD = os.getenv('ADMIN_PASSWORD')

if not User.objects.filter(username=USERNAME).exists():
	User.objects.create_superuser(username=USERNAME, password=PASSWORD)
EOF

ASGI_FILE=$(find /app/ft_transcendence -name "asgi.py" -type f | grep -v "site-packages")   

cd /app/ft_transcendence

find . -type f -name "*.py" | grep -v "__pycache__" | sort

export DJANGO_SETTINGS_MODULE=billpong.settings
exec daphne -b 0.0.0.0 -p 8000 --verbosity 2 billpong.asgi:application
