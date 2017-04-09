import React, { Component } from 'react';

import DebugHistoryItem from './DebugHistoryItem';
import historyStore from '../HistoryStore';

import {observer} from "mobx-react";
import FlipMove from 'react-flip-move';

@observer
export default class DebugView extends Component {
  constructor(props) {
    super(props);
    this.internal = {
      id: null
    };
    this.loadData();
  }
  componentDidMount() {
    this.internal.timer = setInterval(this.loadData, 500);
  }

  componentWillUnmount () {
    clearInterval(this.internal.timer);
  };

  loadData = () => {
    historyStore.update();
  };

  render() {
    return (
    <div className="debugview">
       <FlipMove duration={250} easing="ease">
          { historyStore.history.map(item =>
            <DebugHistoryItem key={item._id.$oid} item={item} />
          )}
        </FlipMove>
    </div>
    );
  }
}
