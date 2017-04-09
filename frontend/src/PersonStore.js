import {SERVER_API_URL} from './config';
import {computable, observable} from "mobx";

class PersonStore {
  @observable people = [];
  constructor() {
    this.update();
    //setInterval(this.update, 3000);
  }
  update = () => {
    fetch(SERVER_API_URL + "/employees")
    .then(response => response.json())
    .then(items => {
      this.people = items;
    });
  }
  getPersonById(id) {
    return this.people.filter(p => p.id === id)[0];
  }
}
export default new PersonStore();
