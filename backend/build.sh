#!/usr/bin/env bash
# Exit on erroe
set -o errexit

#pip install uv
#curl -LsSf https://astral.sh/uv/install.sh | sh
#source $HOME/.local/bin/env
#uv venv .venv
#source .venv/bin/activate

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate
