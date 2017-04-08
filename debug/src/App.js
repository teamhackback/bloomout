import React, { Component } from 'react';
import './App.css';

const socket = require('socket.io-client')('https://leap.hackback.tech');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    fetch('https://leap.hackback.tech/api/history')
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
      <div className="App">
        { this.state.items.map(item =>
          <div key={item._id.$oid} >
            {item.emotion.sentiment.document.score}
          </div>
        )}
      </div>
    );
  }
}

export default App;
