#!/usr/bin/env bash
# Exit on erroe
set -o errexit

#pip install uv

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate
