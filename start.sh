#!/bin/bash

python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn projectapp.wsgi --bind 0.0.0.0:$PORT
