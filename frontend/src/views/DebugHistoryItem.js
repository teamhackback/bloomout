import React, { Component } from 'react';
import personStore from '../PersonStore';
import {observer} from "mobx-react";
import {sortBy, maxBy, values} from 'lodash';


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

function ColoredTextBox(props) {
  const part = props.item;
  const styles = {};
  if (part.type === "text") {
  } else {
    styles["fontWeight"] = "bold";
    if (part.type === "joy") {
      styles["color"] = "green";
    } else {
      styles["color"] = "red";
    }
  }
  return (
    <span style={styles} key={part.id}>{part.text}</span>
  );
}

@observer
export default class DebugHistoryItem extends Component {
  render() {
  const item = this.props.item;
  const body = replaceAll(item.body, "<br />", "");
  let keywords = item.emotion.keywords.map((k) => {
    k.index = -1;
    if (k.text !== "br")
      k.index = body.search(new RegExp(k.text, "i"));
    return k;
  });
  keywords = sortBy(keywords, "index");
  const parts = [];
  let lastIndex = 0;
  keywords.forEach((k) => {
    const index = k.index;
    if (index >= 0) {
      if (index < lastIndex)
        return;
      if (index > 0) {
        parts.push({id: parts.length, text: body.slice(lastIndex, index), type: "text"});
      }
      if (k.emotion !== undefined) {
        const maxEmotion = maxBy(Object.keys(k.emotion), e => k.emotion[e]);
        parts.push({id: parts.length, text: body.slice(index, index + k.text.length), type: maxEmotion});
        lastIndex = index + k.text.length;
      }
    }
  });
  if (lastIndex !== body.length - 1)
    parts.push({id: parts.length, text: body.slice(lastIndex), type: "text"});
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
        {parts.map(part => <ColoredTextBox item={part} key={part.id} />)}
      </div>
    </div>
  )}
}
