#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
watch -n1 rsync -avr --exclude venv --exclude __pycache__ ${DIR}/ root@${host}:/leap/backend
