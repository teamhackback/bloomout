import React, { Component } from 'react';
import {SERVER_URL} from '../config';

const socket = require('socket.io-client')(SERVER_URL);

import DebugHistoryItem from './DebugHistoryItem';

export default class DebugView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    fetch(SERVER_URL + "/api/history")
    .then(function(response) {
      return response.json();
    })
    .then((items) => {
        this.setState({items: items});
    });
    socket.on('new_item', (item) => {
      console.log("new item", item)
      this.setState((state) => {
        const items = state.items.push(item);
        return {
          "items": items
        }
      })
    });
    //socket.on('connect', function(){ console.log("connect");});
    //socket.on('disconnect', function(){});
  }
  render() {
    return (
    <div className="debugview">
        { this.state.items.map(item =>
          <DebugHistoryItem key={item._id.$oid} item={item} />
        )}
    </div>
    );
  }
}
