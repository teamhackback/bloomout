import pymongo
from pymongo import MongoClient

mongo_client = MongoClient()
leap = mongo_client['leap']
employees = leap['employees']
projects = leap['projects']
messages = leap['messages']

employees.create_index(("id"), unique=True)
projects.create_index(("id"), unique=True)
