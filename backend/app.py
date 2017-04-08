#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import abort, Flask, jsonify, request
import os
from os import environ
app = Flask(__name__)
from watson import nltk, tone, personality
from pymongo import MongoClient
import datetime
import pymongo
from bson.json_util import dumps

mongo_client = MongoClient()
leap = mongo_client['leap']
employees = leap['employees']
messages = leap['messages']

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/history', methods=['GET'])
def history():
    return dumps(messages.find().sort('date', pymongo.DESCENDING))

@app.route('/api/chat', methods=['POST'])
def chat():
    req = request.get_json()
    if "body" not in req:
        abort(400, "No text provided.")
    resp = nltk(req["body"])
    messages.insert_one({
        "emotion": resp,
        "from": req["from"],
        "to": req["to"],
        "body": req["body"],
        'created_at': datetime.datetime.now()
    })
    return jsonify(resp)

if __name__ == '__main__':
    port = environ.get("PORT", "6001")
    app.run(debug=True, port=int(port), use_reloader=True)
