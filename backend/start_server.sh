#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/venv/bin/activate
while inotifywait -r -e close_write -e create -e move $DIR ; do $DIR/app.py ; done
