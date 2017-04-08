#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import abort, Flask, jsonify, request
import os
from os import environ
app = Flask(__name__)
from watson import nltk, tone, personality

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/chat', methods=['POST'])
def chat():
    req = request.get_json()
    if "body" not in req:
        abort(400, "No text provided.")
    resp = nltk(req["body"])
    return jsonify(resp)

if __name__ == '__main__':
    port = environ.get("PORT", "6001")
    app.run(debug=True, port=int(port), use_reloader=True)
