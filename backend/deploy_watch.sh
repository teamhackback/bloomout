#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}

watch -n1 rsync -avr --exclude venv --exclude __pycache__ backend/ root@${host}:/leap/backend
