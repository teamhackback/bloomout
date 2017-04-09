import React, { Component } from 'react';
import { SERVER_URL } from '../config';

import ProgressBar from './ProgressBar';
import Images from '../assets';
import Tiles from './Tiles';

class ProfileOverviewDetailed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      happiness: 0,
      avg_weekly_hours: 0,
      num_projects: 0
    }
  }

  loadData = () => {
    const id = this.props.match.params.id;
    fetch(SERVER_URL + "/api/employee/" + id)
    .then(response => response.json())
    .then(data => {
      this.setState({
        happiness: Math.round(data['satisfaction'] * 100),
        avg_weekly_hours: Math.round(data['avg_monthly_hours'] / 4),
        num_projects: data['number_project'] 
      })
    });
  };

  componentDidMount() {

    this.internal.timer = setInterval(this.loadData, 500);
  }
  
  componentWillUnmount = () => {
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
            renderContent: () => <ProgressBar progress="20" colored reverseColor />
          },
          {
            name: 'Fear',
            renderContent: () => <ProgressBar progress="78" colored reverseColor />
          },
          {
            name: 'Sadness',
            renderContent: () => <ProgressBar progress="61" colored reverseColor />
          },
          {
            name: 'Joy',
            renderContent: () => <ProgressBar progress="8" colored reverseColor />
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
