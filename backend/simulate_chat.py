#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
import sys
import json
import time
import datetime
import os
import eventlet
import random
# from flask_socketio import SocketIO
from mongo_base import messages, employees
from generate_db import generate_message
# eventlet.monkey_patch()
# socketio = SocketIO(message_queue='redis://', async_mode='eventlet')

random.seed(9696)
# saved_messages = None
# script_dir = os.path.dirname(os.path.realpath(__file__))
#
# with open(os.path.join(script_dir, 'message_dump'), 'r') as f:
    # contents = f.read()
    # saved_messages = json.loads(contents)

print('dropping previous messages')
messages.drop()

try:
    counter = 0
    while True:
        if counter == 30:
            print('dropping previous messages')
            counter = 0
            messages.drop()

        # message = saved_messages[counter % len(saved_messages)]
        # if '_id' in message:
            # del message['_id']
#
        # message['id'] = counter
        message = generate_message(counter, random.randint(0, 24999))
        messages.insert_one(message)

        # print('updated employee: ', message['from'])

        emp1 = employees.find_one({'id': message['from']})
        print('after update:', emp1)

        # socketio.emit('new_chat', message)
        print('inserted message: ', counter)

        print('---------------------------------------------------')

        counter += 1
        time.sleep(2)
except KeyboardInterrupt:
    sys.exit()
