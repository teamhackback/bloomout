import React, { Component } from 'react';
import { SERVER_URL } from '../config';

import Tiles from './Tiles';
import ProgressBar from './ProgressBar';

const renderPeopleListItem = (ind, va, vb, vc) => (
  <div className="person-combo">
    <ProgressBar progress={vc || 5 + Math.floor(Math.random() * 80)} noText colored />
    <ProgressBar progress={vb || 5 + Math.floor(Math.random() * 50)} noText colored reverseColor />
    <ProgressBar progress={va || 5 + Math.floor(Math.random() * 30)} noText colored reverseColor />
    <img src={SERVER_URL + "/api/images/" + ind} role="presentation" className="PeopleListViewItem" />
  </div>
);

class PeopleListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles : []
    }
  }

  componentDidMount() {
    fetch(SERVER_URL + "/api/employees")
    .then(response => response.json())
    .then(items => {
      this.setState({tiles: items})
    });
  }

  render() {
    return (
      <div className="PeopleListView animated fadeIn white-theme">
        <Tiles whiteTheme tiles={this.state.tiles.map((c, ind) => {
          c.renderContent = () => renderPeopleListItem(ind < 10 ? ind : (ind+1)%9);
          c.link = `/left/profile/${c.id}/basic/right/profile/${c.id}/detailed`;
          return c;
        })} />
      </div>
    );
  }
}

export default PeopleListView;
