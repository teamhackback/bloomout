import React, { Component } from 'react';

import DebugHistoryItem from './DebugHistoryItem';
import historyStore from '../HistoryStore';

import {observer} from "mobx-react";

@observer
export default class DebugView extends Component {
  render() {
    return (
    <div className="debugview">
        { historyStore.history.map(item =>
          <DebugHistoryItem key={item._id.$oid} item={item} />
        )}
    </div>
    );
  }
}
