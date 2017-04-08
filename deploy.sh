#!/bin/bash

host=${HOST:-wehstyle.hackback.tech}


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/frontend/deploy.sh
$DIR/backend/deploy.sh

#ssh root@ec2-54-93-247-247.eu-central-1.compute.amazonaws.com:/leap/backend
