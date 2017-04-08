import sys
import json
import requests
import random
import shutil
import numpy as np
from os import listdir
from os.path import isfile, join
from mongo_base import employees, projects

# seed rng
random.seed(4242)
np.random.seed(4242)

TOTAL_NUM_EMPLOYEES = 20
TOTAL_NUM_PROJECTS = 6
TOTAL_NUM_MESSAGES = 10
DEPARTMENTS = ['hr', 'sales', 'marketing', 'it', 'accounting',
               'support', 'research']
IMAGE_PATH = './images/'
TEXT_DUMP_PATH = '../analytics/text_dump'
FILES = [f for f in listdir(TEXT_DUMP_PATH)
         if isfile(join(TEXT_DUMP_PATH, f))]


def generate_message(random_text_file_index):
    from_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)
    to_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)
    while(from_employee == to_employee):
        to_employee = random.randint(0, TOTAL_NUM_EMPLOYEES - 1)

    with open(join(TEXT_DUMP_PATH, FILES[random_text_file_index]), 'r') as f:
        text = f.read()

    return {
        'from': from_employee,
        'to': to_employee,
        'body': text
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
                print(employee)
                # employees.insert_one(employee)
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
                'salary': random.randint(30000, 120000),
                'satisfaction': generate_normal_value(),
                'last_evaluation': generate_normal_value(),
                'avg_monthly_hours': random.randint(130, 290),
                'years_at_company': random.randint(1, 7),
                'work_accident': random.choice([0, 1]),
                'department': random.choice(DEPARTMENTS),
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
    print('Generating messages')
    random_text_file_index = random.sample(range(25000), TOTAL_NUM_MESSAGES)
    for i in range(TOTAL_NUM_MESSAGES):
        requests.post('http://localhost:6001/api/chat',
                      json=generate_message(random_text_file_index[i]))


def save_employees():
    all_employees = []
    for employee in employees.find():
        employee = {k: v for k, v in employee.items() if k != '_id'}
        all_employees.append(employee)

    with open('employee_dump', 'w') as f:
        f.write(json.dumps(all_employees))


if __name__ == '__main__':
    insert_employees()
    insert_projects()
    insert_messages()

    if not len(sys.argv) > 1:
        save_employees()
