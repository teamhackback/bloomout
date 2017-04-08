#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from watson_developer_cloud import ToneAnalyzerV3, PersonalityInsightsV3, NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 as features
import os


def load(json_file):
    with open(json_file, 'r') as f:
        return json.load(f)

def tone(text):
    return tone_insights.tone(text)

def nltk(text):
    return nltk_insights.analyze(features=[features.Entities(), features.Keywords()],text=text, html=None,
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
print(nltk("this is my experimental text.  Bruce Banner is the Hulk and Bruce Wayne is BATMAN! Superman fears not Banner, but Wayne.'"))
