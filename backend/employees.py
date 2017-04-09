from datetime import datetime
from mongo_base import employees, messages, projects
from classifier import calculate_turnover_risk
import numpy as np

def add_message(from_employee, to_employee, text, emotion):
    sentiment = emotion['sentiment']['document']['score'],
    employee = employees.find_one({'id': from_employee})
    # anger = employee['anger']
    # disgust = employee['disgust']
    # fear = employee['fear']
    # joy = employee['joy']
    # sadness = employee['sadness']
    print('before update:', employee)

    # employees.update_one(
        # {'id': from_employee},
        # {
            # '$set': {
                # 'sentiment': emotion['sentiment']['document']['score'],
                # 'anger': 0.5 * (anger + emotion['emotion']['document']['emotion']['anger']),
                # 'disgust': 0.5 * (disgust + emotion['emotion']['document']['emotion']['disgust']),
                # 'fear': 0.5 * (fear + emotion['emotion']['document']['emotion']['fear']),
                # 'joy': 0.5 * (joy + emotion['emotion']['document']['emotion']['joy']),
                # 'sadness': 0.5 * (sadness + emotion['emotion']['document']['emotion']['sadness'])
            # }
        # }, upsert=True
    # )

    employees.update_one(
        {'id': from_employee},
        {
            '$set': {
                'sentiment': emotion['sentiment']['document']['score'],
                'anger': emotion['emotion']['document']['emotion']['anger'],
                'disgust': emotion['emotion']['document']['emotion']['disgust'],
                'fear': emotion['emotion']['document']['emotion']['fear'],
                'joy': emotion['emotion']['document']['emotion']['joy'],
                'sadness': emotion['emotion']['document']['emotion']['sadness']
            }
        }, upsert=True
    )

    employee2 = employees.find_one({'id': from_employee})
    anger = employee2['anger']
    disgust = employee2['disgust']
    fear = employee2['fear']
    sadness = employee['sadness']
    burnout_risk = 0.25 * (anger + disgust + fear + sadness)

    turnover_risk = calculate_turnover_risk(
        employees.find_one({'id': from_employee})
    )

    if sentiment[0] > 0 and turnover_risk > 0.5:
        turnover_risk = np.random.uniform(0, 0.2)

    employees.update_one(
        {'id': from_employee},
        {
            '$set': {
                'turnover_risk': turnover_risk,
                'burnout_risk': burnout_risk
            }
        }, upsert=True
    )
    return {
        # 'id': message_id,
        'from': from_employee,
        'to': to_employee,
        'body': text,
        'emotion': emotion,
        'created_at': datetime.now()
    }
