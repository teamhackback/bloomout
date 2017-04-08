import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Main from './views/Main.js'
import EmailForm from './views/EmailForm.js'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <Route exact path="/" component={Main} />
            <Route path="/form" component={EmailForm} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
