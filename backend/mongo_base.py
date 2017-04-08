import pymongo
from pymongo import MongoClient

mongo_client = MongoClient()
leap = mongo_client['leap']
employees = leap['employees']
messages = leap['messages']
employees.create_index(("name"), unique=True)
