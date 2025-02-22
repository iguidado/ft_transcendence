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

python /app/ft_transcendence/manage.py runserver 0.0.0.0:8000

python /app/ft_transcendenc/manage.py makemigrations api

python /app/ft_transcendence/manage.py migrate


# python manage.py createsuperuser
