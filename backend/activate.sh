#!/usr/bin/env bash

source .venv/bin/activate

gunicorn backend.asgi:application -k uvicorn.workers.UvicornWorker
