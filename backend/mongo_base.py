import pymongo
from pymongo import MongoClient

mongo_client = MongoClient()
leap = mongo_client['leap']
employees = leap['employees']
projects = leap['projects']
messages = leap['messages']
sentiment_ts = leap['sentiments_ts']
turnover_ts = leap['turnover_ts']

employees.create_index(("id"), unique=True)
projects.create_index(("id"), unique=True)
