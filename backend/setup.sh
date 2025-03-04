#!/bin/sh


# If no venv in directory create it
#

if ! [ -d /app/venv/ ]
then
	python -m venv /app/venv
fi

python -m pip install --no-cache-dir -r /root/requirements.txt 2> /dev/null

if ! [ -d /app/ft_transcendence ]
then
	mkdir -p /app/ft_transcendence
	django-admin startproject billpong /app/ft_transcendence
fi
	
if ! [ -d /app/ft_transcendence/api ]
then
	cd /app/ft_transcendence
	django-admin startapp api
fi

python /app/ft_transcendence/manage.py makemigrations api

python /app/ft_transcendence/manage.py migrate

sleep 5

python /app/ft_transcendence/manage.py loaddata mock_users

python /app/ft_transcendence/manage.py shell <<EOF
from api.models import User
from django.contrib.auth.hashers import make_password

user_passwords = {
    "spongebob": "krabby123",
    "patrick": "starfish!",
    "squidward": "clarinet42"
}

for username, password in user_passwords.items():
    try:
        user = User.objects.get(username=username)
        user.password = make_password(password)
        user.save()
        print(f"Password updated for {username}")
    except User.DoesNotExist:
        print(f"User {username} not found, skipping.")

print("Passwords updated successfully.")
EOF

python /app/ft_transcendence/manage.py shell <<EOF
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billpong.settings')
django.setup()

from api.models import User

USERNAME = os.getenv('DB_USER')
PASSWORD = os.getenv('DB_PASSWORD')

if not User.objects.filter(username=USERNAME).exists():
	User.objects.create_superuser(username=USERNAME, password=PASSWORD)
EOF



python /app/ft_transcendence/manage.py runserver 0.0.0.0:8000

