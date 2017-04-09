import React, { Component } from 'react';
import personStore from '../PersonStore';
import {observer} from "mobx-react";
import {sortBy, maxBy, values} from 'lodash';
import {SERVER_API_URL} from '../config';


function replaceAll(str, from, to) {
  return str.replace(new RegExp(from, 'g'), to);
}

function Value(props) {
  const styles = {"display": "inline-block", "padding": 10, "textAlign": "center"};
  if (props.isMax) {
    styles.fontWeight = "bold";
    styles.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }
  return (
    <div style={styles}>
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
  const imgSize = 30;
  return (
    <div style={{"display": "inline-block", "padding": 7}}>
      <div className="avatar-wrapper" style={{height: imgSize, width: imgSize, display: "inline-block"}}>
        <img src={SERVER_API_URL + "/images/" + person.id} style={{height: imgSize, width: imgSize}} />
      </div>
      <div style={{"fontSize": "18px", display: "inline-block", "verticalAlign": "top", "marginTop": 2, "marginLeft": 5}}>
        {name}
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
  if (lastIndex !== body.length - 1) {
    parts.push({id: parts.length, text: body.slice(lastIndex), type: "text"});
  }
  const maxEmotion = maxBy(Object.keys(item.emotion.emotion.document.emotion), e => item.emotion.emotion.document.emotion[e]);
  return (
    <div style={{"margin": 10}}>
      <div>
        <Value
          value={item.emotion.sentiment.document.score}
          title="Sentiment"
          isMax={maxEmotion === "sentiment"}
        />
        <Value
          value={item.emotion.emotion.document.emotion.sadness}
          title="Sadness"
          isMax={maxEmotion === "sadness"}
        />
        <Value
          value={item.emotion.emotion.document.emotion.joy}
          title="Joy"
          isMax={maxEmotion === "joy"}
        />
        <Value
          value={item.emotion.emotion.document.emotion.fear}
          title="Fear"
          isMax={maxEmotion === "fear"}
        />
        <Value
          value={item.emotion.emotion.document.emotion.disgust}
          title="Disgust"
          isMax={maxEmotion === "disgust"}
        />
        <Value
          value={item.emotion.emotion.document.emotion.anger}
          title="Anger"
          isMax={maxEmotion === "anger"}
        />
      </div>
      <div>
        <Sender text="From" person={item.from} />
        <span style={{"fontSize": 40, "verticalAlign": "top", "display": "inline-block", "height": 20, "marginTop": -13}}>
          →
        </span>
        <Sender text="To" person={item.to} />
      </div>

      <div className="debug-msg">
        {parts.map(part => <ColoredTextBox item={part} key={part.id} />)}
      </div>
    </div>
  )}
}
