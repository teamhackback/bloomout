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

const Button = (props) => (
  <a className="button" href="#" {...props}>{props.children}<span></span></a>
);

const WelcomeLeftScreen = (props) => (
<div className="WelcomeLeftScreen">
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
  <div className="WelcomeOverviewDetailed">
    detailed overview left
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
