import React, { Component } from 'react';
import { SERVER_URL } from '../config';

import ProgressBar from './ProgressBar';

const renderPeopleListItem = (ind, va, vb, vc) => (
  <div className="person-combo">
    <ProgressBar progress={vc || 5 + Math.floor(Math.random() * 80)} noText colored />
    <ProgressBar progress={vb || 5 + Math.floor(Math.random() * 50)} noText colored reverseColor />
    <ProgressBar progress={va || 5 + Math.floor(Math.random() * 30)} noText colored reverseColor />
    <img src={SERVER_URL + "/api/images/" + ind} role="presentation" className="PeopleListViewItem" />
  </div>
);

class ProfileOverviewBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      happiness: 0
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(SERVER_URL + "/api/employee/" + id)
    .then(response => response.json())
    .then(data => {
      this.setState({
        happiness: Math.round(data['satisfaction'] * 100)
      })
    });
  }

  render() {
    const id = this.props.match.params.id;
    return (
      <div className="ProfileOverviewBasic dark-theme animated fadeIn">
        {renderPeopleListItem(id, this.props.happiness, 49, 19) }
        <div className="profile-stats-row" style={{
            width: "100%", display: "flex", justifyContent: "center", marginBottom: "1em"
          }}>
          <div><div className="tile-main-text">{this.state.happiness + '%'}</div><div>Happiness</div></div>
          <div><div className="tile-main-text">49%</div><div>Turnover risk</div> </div>
          <div><div className="tile-main-text">32%</div><div>Risk of burnout</div> </div>
        </div>
      </div>
    );
  }
}

export default ProfileOverviewBasic;
