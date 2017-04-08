#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}

rsync -avr --exclude venv --exclude __pycache__ backend/ root@${host}:/leap/backend
