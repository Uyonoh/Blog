#!/usr/bin/env bash
# Exit on erroe
set -o errexit

#pip install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

uv pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate
