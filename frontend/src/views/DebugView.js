import React, { Component } from 'react';

import DebugHistoryItem from './DebugHistoryItem';
import historyStore from '../HistoryStore';

import {observer} from "mobx-react";
import FlipMove from 'react-flip-move';

@observer
export default class DebugView extends Component {
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
