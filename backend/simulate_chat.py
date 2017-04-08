import sys
import time
import random
from generate_db import generate_message
from mongo_base import messages

try:
    used_files = []
    counter = 0
    while True:
        file_index = random.randint(0, 25000)
        while file_index in used_files:
            file_index = random.randint(0, 25000)
        messages.insert_one(generate_message(counter, file_index))

        used_files.append(file_index)
        counter += 1

        time.sleep(2)
except KeyboardInterrupt:
    sys.exit()
