import sys
import json
import requests
import random
import shutil
import numpy as np
from datetime import datetime
from os import listdir
from os.path import isfile, join
from mongo_base import employees, projects, messages, sentiment_ts
from classifier import calculate_turnover_risk
from watson import nltk


# seed rng
random.seed(4242)
np.random.seed(4242)

TOTAL_NUM_EMPLOYEES = 20
TOTAL_NUM_PROJECTS = 6
TOTAL_NUM_MESSAGES = 5
DEPARTMENTS = ['hr', 'sales', 'marketing', 'IT', 'accounting',
               'support', 'RandD', 'product_mng', 'technical']
IMAGE_PATH = './images/'
TEXT_DUMP_PATH = '../analytics/text_dump'
FILES = [f for f in listdir(TEXT_DUMP_PATH)
         if isfile(join(TEXT_DUMP_PATH, f))]


def generate_message(message_id, random_text_file_index):
    from_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)
    to_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)
    while(from_employee == to_employee):
        to_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)

    with open(join(TEXT_DUMP_PATH, FILES[random_text_file_index]), 'r') as f:
        text = f.read()

    emotion = nltk(text)

    # add sentiment to timeseries
    sentiment_ts.insert_one({
        'timestamp': datetime.now(),
        'employee_id': from_employee,
        'value': emotion['sentiment']['document']['score']
    })

    employees.update_one(
        {'id': from_employee},
        {
            '$set': {
                'sentiment': emotion['sentiment']['document']['score'],
            }
        }, upsert=True
    )

    turnover_risk = calculate_turnover_risk(
        employees.find_one({'id': from_employee})
    )

    employees.update_one(
        {'id': from_employee},
        {
            '$set': {
                'turnover_risk': turnover_risk
            }
        }, upsert=True
    )

    return {
        'id': message_id,
        'from': from_employee,
        'to': to_employee,
        'body': text,
        'emotion': emotion
    }


def generate_random_project_list():
    return random.sample(range(TOTAL_NUM_PROJECTS),
                         random.randint(1, TOTAL_NUM_PROJECTS))


def generate_normal_value():
    val = np.random.normal(0.5, 0.2)
    return 1 if val > 1 else val


def get_project_members(i):
    res = []
    for employee in employees.find():
        if i in employee['projects']:
            res.append(employee['id'])

    return res


def insert_employees():
    if len(sys.argv) > 1:
        print('Loading employees from file')

        with open(sys.argv[1], 'r') as file:
            contents = file.read()
            all_employees = json.loads(contents)
            for employee in all_employees:
                employees.insert_one(employee)
    else:
        print('Generating new employees')

        for i in range(TOTAL_NUM_EMPLOYEES):
            employee_projects = generate_random_project_list()
            employee_data = requests.get('https://uinames.com/api/?ext')
            employee_data = employee_data.json()

            r = requests.get(employee_data['photo'], stream=True)
            with open('./images/' + str(i) + '.jpg', 'wb') as file:
                shutil.copyfileobj(r.raw, file)
            del r

            employee = {
                'id': i,
                'name': employee_data['name'] + ' ' + employee_data['surname'],
                'gender': employee_data['gender'],
                'photo': './images/' + str(i) + '.jpg',
                'projects': generate_random_project_list(),
                'number_project': len(employee_projects),
                'salary': random.choice([1, 2, 3]),
                'satisfaction': generate_normal_value(),
                'last_evaluation': generate_normal_value(),
                'avg_monthly_hours': random.randint(130, 290),
                'years_at_company': random.randint(1, 7),
                'work_accident': random.choice([0, 1]),
                'department': random.randint(0, len(DEPARTMENTS) - 1),
                'promotion_last_5years': random.choice([0, 1])
            }

            employees.insert_one(employee)


def insert_projects():
    print('Adding projects')
    for i in range(TOTAL_NUM_PROJECTS):
        project = {
            'id': i,
            'members': get_project_members(i)
        }

        projects.insert_one(project)


def insert_messages():
    if len(sys.argv) > 2:
        print('Loading messages from file')

        with open(sys.argv[2], 'r') as file:
            contents = file.read()
            all_messages = json.loads(contents)
            for message in all_messages:
                messages.insert_one(message)
    else:
        print('Generating messages')
        random_text_file_index = random.sample(range(25000),
                                               TOTAL_NUM_MESSAGES)
        for i in range(TOTAL_NUM_MESSAGES):
            messages.insert_one(generate_message(i, random_text_file_index[i]))


def save_employees():
    all_employees = []
    for employee in employees.find():
        employee = {k: v for k, v in employee.items() if k != '_id'}
        all_employees.append(employee)

    with open('employee_dump', 'w') as f:
        f.write(json.dumps(all_employees))


def save_messages():
    all_messages = []
    for message in messages.find():
        message = {k: v for k, v in message.items() if k != '_id'}
        all_messages.append(message)

    with open('message_dump', 'w') as f:
        f.write(json.dumps(all_messages))


if __name__ == '__main__':
    insert_employees()
    insert_projects()
    insert_messages()

    if not len(sys.argv) > 1:
        save_employees()
        save_messages()
