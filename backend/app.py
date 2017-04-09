#!/usr/bin/env python
# -*- coding: utf-8 -*-

from os import environ
import os
import datetime
import pymongo
from bson.json_util import dumps
from mongo_base import employees, messages, projects
from graph import build_graph
from flask import abort, Flask, jsonify, request,\
    send_from_directory
from watson import nltk, tone, personality
from werkzeug import Response
from flask_socketio import SocketIO
# import eventlet
# eventlet.monkey_patch()

UPLOAD_FOLDER = './images/'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# socketio = SocketIO(app, message_queue='redis://', async_mode='eventlet')
# socketio = SocketIO(app, message_queue='redis://', async_mode=None)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/api/history', methods=['GET'])
def history():
    resp = messages.find().sort('created_at', pymongo.DESCENDING).limit(20)
    return Response(
        dumps(list(resp)),
        mimetype='application/json'
    )


@app.route('/api/images/<employeeid>')
def images(employeeid):
    employee = employees.find_one({"id": int(employeeid)})
    if employee is None:
        abort(404, "Not found.")
    employee = employee["photo"]
    photoid = os.path.splitext(os.path.basename(employee))[0]
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               photoid + '.jpg')


@app.route('/api/avatar/<employeeid>')
def avatars(employeeid):
    employee = employees.find_one({"id": int(employeeid)})
    if employee is None:
        abort(404, "Not found.")
    employee = employee["photo"]
    photoid = os.path.splitext(os.path.basename(employee))[0]
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               photoid + '_avatar.png')


@app.route('/api/chat', methods=['POST'])
def chat():
    req = request.get_json()
    if "body" not in req:
        abort(400, "No text provided.")
    # print(req["body"])
    resp = nltk(req["body"])
    messages.insert_one({
        "emotion": resp,
        "from": req["from"],
        "to": req["to"],
        "body": req["body"],
        'created_at': datetime.datetime.now()
        })
    # socketio.emit('new_chat', resp)
    return jsonify(resp)


@app.route('/api/graph', methods=['GET'])
def graph():
    return jsonify(build_graph())


@app.route('/api/employee/<emp_id>', methods=['GET'])
def get_employee(emp_id):
    employee = employees.find_one({'id': int(emp_id)})
    if employee:
        return Response(
            dumps(employee),
            mimetype='application/json'
        )
    else:
        abort(400, 'Employee not found')


@app.route('/api/employees', methods=['GET', 'POST'])
def get_or_create_employees():
    if request.method == 'POST':
        return ('', 204)
    else:
        all_employees = []
        for employee in employees.find():
            all_employees.append(employee)

        return Response(
            dumps(all_employees),
            mimetype='application/json'
        )


@app.route('/api/project/<proj_id>', methods=['GET'])
def get_project(proj_id):
    project = projects.find_one({'id': int(proj_id)})
    if project:
        return Response(
            dumps(project),
            mimetype='application/json'
        )
    else:
        abort(400, 'Project not found')


@app.route('/api/projects', methods=['GET'])
def get_or_create_projects():
    if request.method == 'POST':
        return ('', 204)
    else:
        all_projects = []
        for project in projects.find():
            all_projects.append(project)

        return Response(
            dumps(all_projects),
            mimetype='application/json'
        )


@app.route('/api/project/<message_id>', methods=['GET'])
def get_message(message_id):
    message = messages.find_one({'id': int(message_id)})
    if message:
        return Response(
            dumps(message),
            mimetype='application/json'
        )
    else:
        abort(400, 'Project not found')


@app.route('/api/messages', methods=['GET'])
def get_or_create_messages():
    if request.method == 'POST':
        return ('', 204)
    else:
        all_messages = []
        for message in messages.find():
            all_messages.append(message)

        return Response(
            dumps(all_messages),
            mimetype='application/json'
            )


# @socketio.on('connect')
# def test_connect():
    # socketio.emit('new_connect', {'data': 'Connected', 'count': 0})

if __name__ == '__main__':
    port = environ.get("PORT", "6001")
    # socketio.run(app, debug=True, port=int(port), use_reloader=True)
    app.run(debug=True, port=int(port), use_reloader=True)
