import React, { Component } from 'react';
import { SERVER_URL } from '../config';

import ProgressBar from './ProgressBar';
import Images from '../assets';
import Tiles from './Tiles';
import peopleStore from '../PersonStore';

class ProfileOverviewDetailed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      happiness: 0,
      avg_weekly_hours: 0,
      num_projects: 0,
      joy: 0,
      anger: 0,
      sadness: 0,
      disgust: 0,
      fear: 0,
    }
    this.internal = {
      timer: null,
      id: null
    }
  }

  loadData = () => {
    console.log("load");
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
    });
  };

  update(data) {
    this.setState({
        happiness: Math.round(data['satisfaction'] * 100),
        avg_weekly_hours: Math.round(data['avg_monthly_hours'] / 4),
        num_projects: data['number_project'],
        joy: Math.round(data['joy'] * 100),
        anger: Math.round(data['anger'] * 100),
        sadness: Math.round(data['sadness'] * 100),
        disgust: Math.round(data['disgust'] * 100),
        fear: Math.round(data['fear'] * 100)
      })
  }

  componentDidMount() {
    this.internal.timer = setInterval(this.loadData, 1500);
    this.loadData();
  }

  componentDidUpdate(props) {
    if (this.internal.id !== this.props.match.params.id)
      this.loadData();
  }

  componentWillUnmount () {
    clearInterval(this.internal.timer);
  };

  render() {
  const id = this.props.match.params.id;
    return (
      <div className="ProfileOverviewDetailed animated fadeIn">
        <Tiles link="#" tiles={[
          {
            name: 'Interactions',
            renderContent: () => <ProgressBar progress="42" colored />,
            link: `/left/profile/${id}/basic/right/network`
          },
          {
            name: 'Engagement',
            renderContent: () => <ProgressBar progress="56" colored />
          },
          {
            name: 'Avg. Weekly Hours',
            renderContent: () => <div className="tile-main-text">{this.state.avg_weekly_hours}</div>
          },
          {
            name: 'Disgust',
            renderContent: () => <ProgressBar progress={this.state.disgust} colored reverseColor />
          },
          {
            name: 'Fear',
            renderContent: () => <ProgressBar progress={this.state.fear} colored reverseColor />
          },
          {
            name: 'Sadness',
            renderContent: () => <ProgressBar progress={this.state.sadness} colored reverseColor />
          },
          {
            name: 'Joy',
            renderContent: () => <ProgressBar progress={this.state.joy} colored reverseColor />
          },
          {
            name: 'Participation',
            renderContent: () => <div className="tile-main-text colspan-2">158/160</div>
          },
          {
            name: 'Number of Projects',
            renderContent: () => <div className="tile-main-text">{this.state.num_projects}</div>
          }
        ].map((t, ind) => {
          t.icon = Images.icons.artboards[ind%6];
          return t;
        })} />
    </div>
    );
  }
}

export default ProfileOverviewDetailed;
