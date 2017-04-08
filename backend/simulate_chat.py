import sys
import json
import time
from mongo_base import messages


saved_messages = None

with open('./message_dump', 'r') as f:
    contents = f.read()
    saved_messages = json.loads(contents)

print('dropping previous messages')
messages.drop()

try:
    counter = 0
    while True:
        if counter == 20:
            print('dropping previous messages')
            counter = 0
            messages.drop()

        message = saved_messages[counter % len(saved_messages)]
        if '_id' in message:
            del message['_id']
        message['id'] = counter
        messages.insert_one(message)
        print('inserted message: ', counter)

        counter += 1
        time.sleep(2)
except KeyboardInterrupt:
    sys.exit()
