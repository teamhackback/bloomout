import React, { Component } from 'react';
import personStore from '../PersonStore';
import {observer} from "mobx-react";


function replaceAll(str, from, to) {
  return str.replace(new RegExp(from, 'g'), to);
}

function Value(props) {
  return (
    <div style={{"display": "inline-block", "padding": 10}}>
      <div style={{"fontSize": "24px"}}>
        {Math.round(props.value * 100) / 100 }
      </div>
      <div style={{"fontSize": "12px", "color": "grey"}}>
        {props.title}
      </div>
    </div>
  )
}

function Sender(props) {
  const person = personStore.getPersonById(props.person) || {};
  const name = person.name || "NAME";
  return (
    <div style={{"display": "inline-block", "padding": 10}}>
      <div style={{"fontSize": "24px"}}>
        {name}
      </div>
      <div style={{"fontSize": "12px", "color": "grey"}}>
        {props.text}
      </div>
    </div>
  )
}

@observer
export default class DebugHistoryItem extends Component {
  render() {
  const item = this.props.item;
  return (
    <div style={{"margin": 10}}>


      <div>
        <Value
          value={item.emotion.sentiment.document.score}
          title="Sentiment"
        />
        <Value
          value={item.emotion.emotion.document.emotion.sadness}
          title="Sadness"
        />
        <Value
          value={item.emotion.emotion.document.emotion.joy}
          title="Joy"
        />
        <Value
          value={item.emotion.emotion.document.emotion.fear}
          title="Fear"
        />
        <Value
          value={item.emotion.emotion.document.emotion.disgust}
          title="Disgust"
        />
        <Value
          value={item.emotion.emotion.document.emotion.anger}
          title="Anger"
        />
      </div>
      <div>
        <Sender text="From" person={item.from} />
        <Sender text="To" person={item.to} />
      </div>

      <div className="debug-msg">
        { replaceAll(item.body, "<br />", "") }
      </div>
    </div>
  )}
}
