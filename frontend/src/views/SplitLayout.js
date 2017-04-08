import React, { Component } from 'react';

import Styles from './SplitLayout.css';

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
        {this.props.children}
      </div>
    );
  }
}

export default SplitLayout;
