#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rsync -avr --exclude venv --exclude __pycache__ $DIR/backend/ root@${host}:/leap/backend
