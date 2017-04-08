import React, { Component } from 'react';
import Styles from './Main.css';

class SplitLayout extends Component {
  render() {
    return (
      <div className={Styles.SplitLayout}>
        <div className={Styles.SplitPane}>
          {this.props.left}
        </div>
        <div className={Styles.SplitPane}>
          {this.props.right}
        </div>
      </div>
    );
  }
}

class Tiles extends Component {
  render() {
    const colors = ['#A4A4A4', "#727272", "#B7B7B7", "#918E8E", "#606060", "#4D4D4D"];
    return (
      <div className="tiles">
        {this.props.tiles.map((tile, ind) => (
          <div key={ind} className={`tile`}
            style={{
              background: colors[ind]
            }}>
            <span className="title">{tile.name}</span>
          </div>
        ))}
      </div>
    );
  }
}

const Button = (props) => (
  <a className="button" href="#" {...props}>{props.children}<span></span></a>
);

const WelcomeLeftScreen = (props) => (
<div className="WelcomeLeftScreen animated fadeIn">
  <div>logo</div>
  <h1>Welcome, <span className="c-p">hackBack</span></h1>
  <strong>This is your risk management application</strong>
  <p>
    Discover what risks you have in your management and employee relations.
    Pop-up your official trust fund polaroid, put a bird on it stumptown enamel semantics actually.
  </p>
  <Button onClick={props.showOverview}>Show me more</Button>
</div>
);

const WelcomeOverviewDetailed = () => (
  <div className="WelcomeOverviewDetailed animated fadeIn">
    <Tiles tiles={[
      {
        name: 'Employee risks'
      },
      {
        name: 'Project risks'
      },
      {
        name: 'Client risks'
      },
      {
        name: 'Quality of interactions'
      },
      {
        name: 'Recommendations'
      },
      {
        name: 'Black box score'
      }
    ]} />
  </div>
);
const WelcomeOverviewBasic = () => (
  <div className="WelcomeOverviewBasic dark-theme">
    basic overview left
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
        left={ !this.state.overviewShown ?
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
