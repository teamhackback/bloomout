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

const WelcomeLeftScreen = (props) => (
<div className="WelcomeLeftScreen">
  <h1>Welcome to your company</h1>
  <p>Discover what risks you have in your management and employee relations.
    Pop-up your official trust fund polaroid, put a bird on it stumptown enamel semantics actually.
  </p>
  <button onClick={props.showOverview}>Show me more</button>
</div>
);

const WelcomeOverviewDetailed = () => (
  <div>detailed overview left</div>
);
const WelcomeOverviewBasic = () => (
  <div>basic overview right</div>
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
