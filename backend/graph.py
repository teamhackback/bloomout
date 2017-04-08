#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pymongo
from bson.json_util import dumps
from mongo_base import employees, messages
from collections import defaultdict

emotions = ["anger", "joy", "fear", "disgust", "sadness"]


def dump_employee(employee_id):
    employee = employees.find_one({"id": employee_id})
    employee = {k: v for k, v in employee.items() if k != '_id'}

    return employee


def build_graph():
    people = set()
    msgs = messages.find()
    for msg in msgs:
        people.add(msg["to"])
        people.add(msg["from"])

    #for person in people:
    #    employees.update_one({
    #        "name": person
    #    }, {
    #        "$set": {
    #            "name": person
    #        }
    #    }, upsert=True)

    g = defaultdict(lambda: defaultdict(lambda: {
        "nr_msgs": 0,
        "emotion": {
            "anger": 0.0,
            "joy": 0.0,
            "fear": 0.0,
            "disgust": 0.0,
            "sadness": 0.0,
        },
        "sentiment": 0.0,
    }))

    msgs = messages.find()
    for msg in msgs:
        g[msg['from']][msg['to']]["nr_msgs"] += 1
        g[msg['from']][msg['to']]["sentiment"] += \
            msg["emotion"]["sentiment"]["document"]["score"]
        for emotion in emotions:
            g[msg['from']][msg['to']]["emotion"][emotion] +=\
                msg["emotion"]["emotion"]["document"]["emotion"][emotion]

    g = {k: dict(v) for k, v in g.items()}
    return {
        "graph": g,
        "nodes": [dump_employee(person) for person in people],
    }


if __name__ == '__main__':
    print(build_graph())
