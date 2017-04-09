import {SERVER_URL} from './config';
import {observable} from "mobx";
import {sortBy} from 'lodash';

//const socket = require('socket.io-client')(SERVER_URL);

class HistoryStore {
  @observable history = [];
  constructor() {
    //socket.on('new_chat', (item) => {
      //console.log("new item", item)
      //this.items.push(item);
    //});
    //socket.on('data', (item) => {
      //console.log("data", "foo");
    //});
    //socket.on('connect', function(){ console.log("connect");});
    //socket.on('disconnect', function(){});
    this.update();
    setInterval(this.update, 500);
  }
  update = () => {
    fetch(SERVER_URL + "/api/history")
    .then(response => response.json())
    .then(items => {
      this.history = items;
    });
  }
}
export default new HistoryStore();
