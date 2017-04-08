#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}

npm run build
rsync -avr build/ root@${host}:/leap/frontend
