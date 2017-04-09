import React, { Component } from 'react';
import { SERVER_URL } from '../config';
import peopleStore from '../PersonStore';

import ProgressBar from './ProgressBar';

const renderPeopleListItem = (ind, va, vb, vc) => (
  <div className="person-combo animated fadeInDown">
    <ProgressBar progress={vc} noText colored reverseColor />
    <ProgressBar progress={vb} noText colored reverseColor />
    <ProgressBar progress={va} noText colored />
    <img src={SERVER_URL + "/api/images/" + ind} role="presentation" className="PeopleListViewItem" />
  </div>
);

class ProfileOverviewBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      happiness: 0,
      turnover_risk: 0,
      burnout_risk: 0,
    }
    this.internal = {
      timer: null,
      id: null
    }
  }

  loadData = () => {
    this.internal.id = this.props.match.params.id;
    const id = this.internal.id;
    const person = peopleStore.getPersonById(id);
    if (person !== undefined) {
      this.update(person);
    }
    fetch(SERVER_URL + "/api/employee/" + id)
    .then(response => response.json())
    .then(data => {
      this.update(data);
      console.log(this.state);
    });
  };

  update(data) {
    this.setState({
     name: data['name'],
     happiness: Math.floor(data['satisfaction'] * 100),
     turnover_risk: Math.floor(data['turnover_risk'] * 100),
     burnout_risk: Math.floor(data['burnout_risk'] * 100),
    });
  }

  componentDidMount() {
    this.loadData();
    this.internal.timer = setInterval(this.loadData, 1500);
  }

  componentDidUpdate(props) {
    if (this.internal.id !== this.props.match.params.id)
      this.loadData();
  };

  componentWillUnmount () {
    clearInterval(this.internal.timer);
  };

  render() {
    const id = this.props.match.params.id;
    return (
      <div className="ProfileOverviewBasic dark-theme animated fadeIn">
        {renderPeopleListItem(id, this.state.happiness, this.state.turnover_risk, this.state.burnout_risk) }
        <span style={{ fontSize: '2.5em', fontWeight: 'bold', display: 'inline-block', marginBottom: '2em', fontFamily: 'Montserrat, sans-serif'}}>{this.state.name}</span>
        <div className="profile-stats-row" style={{
            width: "100%", display: "flex", justifyContent: "center", marginBottom: "1em", paddingBottom: '1.5em', backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
          <div><div className="tile-main-text">{(this.state.happiness || 0) + '%'}</div><div>Happiness</div></div>
          <div><div className="tile-main-text">{(this.state.turnover_risk || 0) + '%'}</div><div>Turnover risk</div> </div>
          <div><div className="tile-main-text">{(this.state.burnout_risk || 0)+ '%'}</div><div>Risk of burnout</div> </div>
        </div>
      </div>
    );
  }
}

export default ProfileOverviewBasic;
