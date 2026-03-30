cd projectapp || exit 1
python manage.py migrate || exit 1
python manage.py collectstatic --noinput || exit 1
gunicorn projectapp.wsgi --bind 0.0.0.0:$PORT