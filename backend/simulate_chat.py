#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
import sys
import json
import time
from mongo_base import messages
import os
import eventlet
from flask_socketio import SocketIO
eventlet.monkey_patch()
socketio = SocketIO(message_queue='redis://', async_mode='eventlet')
import datetime


saved_messages = None
script_dir = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(script_dir, 'message_dump'), 'r') as f:
    contents = f.read()
    saved_messages = json.loads(contents)

print('dropping previous messages')
messages.drop()

try:
    counter = 0
    while True:
        if counter == 8:
            print('dropping previous messages')
            counter = 0
            messages.drop()

        message = saved_messages[counter % len(saved_messages)]
        if '_id' in message:
            del message['_id']
        message['id'] = counter
        messages.insert_one(message)
        message['created_at'] = datetime.datetime.now()
        socketio.emit('new_chat', message)
        print('inserted message: ', counter)

        counter += 1
        time.sleep(2)
except KeyboardInterrupt:
    sys.exit()
