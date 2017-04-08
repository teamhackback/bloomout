import React, { Component } from 'react';
import Tiles from './Tiles';
import ProgressBar from './ProgressBar';
import SplitLayout from './SplitLayout';
import Images from '../assets';

const Button = (props) => (
  <a className="button" href="#" {...props}>{props.children}<span></span></a>
);

const WelcomeLeftScreen = (props) => (
<div className="WelcomeLeftScreen animated fadeIn">
  <img src={Images.logo} role="presentation" />
  <h1>Welcome, <span className="c-p">hackBack</span></h1>
  <strong>This is your risk management application</strong>
  <p>
    Discover what risks you have in your management and employee relations.
    Pop-up your official trust fund polaroid, put a bird on it, and find lorem ipsum semantics easily.
  </p>
  <Button onClick={props.showOverview}>Show me more</Button>
</div>
);

const WelcomeOverviewBasic = () => (
  <div className="WelcomeOverviewBasic dark-theme">
    <ProgressBar progress="63" infoText="Overall risk" />
  </div>
);

const WelcomeOverviewDetailed = () => (
  <div className="WelcomeOverviewDetailed animated fadeIn">
    <Tiles tiles={[
      {
        name: 'Employee risks',
        renderContent: () => <ProgressBar progress="42" colored reverseColor />,
      },
      {
        name: 'Project risks',
        renderContent: () => <ProgressBar progress="14" colored reverseColor />
      },
      {
        name: 'Client risks',
        renderContent: () => <ProgressBar progress="20" colored reverseColor />
      },
      {
        name: 'Interaction quality',
        renderContent: () => <ProgressBar progress="62" colored />
      },
      {
        name: 'Company mood',
        renderContent: () => <ProgressBar progress="28" colored />
      },
      {
        name: 'Black box score',
        renderContent: () => <div className="tile-main-text">12p.</div>
      }
    ].map((t, ind) => {
      t.icon = Images.icons.artboards[ind];
      return t;
    })} />
  </div>
);


class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overviewShown: false
    };
    this.showOverview = this.showOverview.bind(this);
  }

  showOverview() {
    this.setState({ overviewShown: true });
  }

  render() {
    return (
      <SplitLayout
        left={ this.state.overviewShown ?
          <WelcomeOverviewDetailed /> : <WelcomeLeftScreen showOverview={this.showOverview}/>
        }
        right={<WelcomeOverviewBasic />}
      />
    );
  }
} 

class Main extends Component {
  render() {
    return <Intro />;
  }
}

export default Main;
