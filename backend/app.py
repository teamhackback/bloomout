#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
import os
from os import environ
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/chat', methods=['POST'])
def chat():
    req_input = request.get_json()
    #"to", from, body
    print(req_input)

if __name__ == '__main__':
    port = environ.get("PORT", "6001")
    app.run(port=int(port))
