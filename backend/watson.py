#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from watson_developer_cloud import ToneAnalyzerV3, PersonalityInsightsV3
from natural_language_understanding import NaturalLanguageUnderstandingV1
import natural_language_understanding_features as features
import os

# https://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/?python#post-tone
# https://www.ibm.com/watson/developercloud/personality-insights/api/v3/?curl#response-handling
# https://www.ibm.com/watson/developercloud/nl-classifier.html
# https://www.ibm.com/watson/developercloud/natural-language-understanding.html


def load(json_file):
    with open(json_file, 'r') as f:
        return json.load(f)

def tone(text):
    return tone_insights.tone(text)

def nltk(text):
    # https://github.com/watson-developer-cloud/python-sdk/blob/master/watson_developer_cloud/natural_language_understanding/features/v1/__init__.py
    local_features = [
            features.Emotion(document=True),
            features.Sentiment(document=True),
            features.Keywords(emotion=True, sentiment=True)]
    return nltk_insights.analyze(features=local_features,text=text, html=None,
                clean=True, xpath=None, fallback_to_raw=True,
                return_analyzed_text=False)

def personality(text):
    return personality_insights.profile(text, content_type='text/plain', content_language=None,
  accept='application/json', accept_language=None, raw_scores=False,
  consumption_preferences=False, csv_headers=False)


def init():
    global tone_insights, personality_insights, nltk_insights
    current_dir = os.path.dirname(os.path.realpath(__file__))
    personality_config = load(os.path.join(current_dir, "./credentials/personality.json"))
    tone_config = load(os.path.join(current_dir, "./credentials/tone.json"))
    nltk_config = load(os.path.join(current_dir, "./credentials/nltk.json"))

    tone_insights = ToneAnalyzerV3(
        version='2016-10-20',
        username=tone_config['username'],
        password=tone_config['password'])

    personality_insights = PersonalityInsightsV3(
        version='2016-10-20',
        username=personality_config['username'],
        password=personality_config['password'])

    nltk_insights = NaturalLanguageUnderstandingV1(
        version='2017-02-17',
        username=nltk_config['username'],
        password=nltk_config['password'])

init()
#print(tone("Hi there. This is Sebastian."))
#print(personality("This is Sebastian from HackBack."))
print(json.dumps(nltk("IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.")))
