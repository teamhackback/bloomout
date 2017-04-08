import {SERVER_URL} from './config';
import {observable} from "mobx";

const socket = require('socket.io-client')(SERVER_URL);

class HistoryStore {
  @observable history = [];
  constructor() {
    fetch(SERVER_URL + "/api/history")
    .then(response => response.json())
    .then(items => {
      this.history = items;
    });
    socket.on('new_item', (item) => {
      console.log("new item", item)
      this.items.push(item);
    });
    //socket.on('connect', function(){ console.log("connect");});
    //socket.on('disconnect', function(){});

  }
}
export default new HistoryStore();
