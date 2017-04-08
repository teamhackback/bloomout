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

const Intro = () => (
  <SplitLayout left="the" right={"the right"} />
);

class Main extends Component {
  render() {
    return <Intro />;
  }
}

export default Main;
