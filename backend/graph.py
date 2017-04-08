#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pymongo
from bson.json_util import dumps
from mongo_base import employees, messages

def build_graph():
    people = set()
    msgs = messages.find()
    for msg in msgs:
        people.add(msg["to"])
        people.add(msg["from"])

    for person in people:
        employees.update_one({
            "name": person
        }, {
            "$set": {
                "name": person
            }
        }, upsert=True)
    print(people)

if __name__ == '__main__':
    build_graph()
