import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Main from './views/Main.js'
import EmailForm from './views/EmailForm.js'
import DebugView from './views/DebugView.js'
import Styles from './views/SplitLayout.css';

const routes = [
  {

    path: "/overview/intro",
    component: Main.WelcomeLeftScreen
  },
  {
    path: "/overview/basic",
    component: Main.WelcomeOverviewBasic
  },
  {
    path: "/overview/detailed",
    component: Main.WelcomeOverviewDetailed
  },
  {
    path: "/employees/basic",
    component: Main.PeopleOverviewBasic
  },
  {
    path: "/employees/detailed",
    component: Main.PeopleOverviewListView
  },
  {
    path: "/profile/:id/basic",
    component: Main.ProfileOverviewBasic
  },
  {
    path: "/profile/:id/detailed",
    component: Main.ProfileOverviewDetailed
  },
  {
    path: "/network",
    component: Main.NetworkView
  },
];

routes.forEach((e, i) => {
  e.id = i;
});


const SplitScreen = () => {
  return (
    <div className={Styles.SplitLayout}>
        <div className={Styles.SplitPane}>
        <Switch>
          { routes.map(route => <Route key={route.id} path={"/left" + route.path} component={route.component} /> )}
        </Switch>
      </div>
      <div className={Styles.SplitPane}>
        <Switch>
          { routes.map(route => <Route key={route.id} path={"/left/(.*)/right" + route.path} component={route.component} /> )}
        </Switch>
      </div>
    </div>
  )
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <Route path="/network" component={Main.Network} />
            <Route path="/form" component={EmailForm} />
            <Route path="/debug" component={DebugView} />
            <Route path="/" component={SplitScreen} />
            <Route path="/">
              <Redirect to="/left/overview/intro/right/overview/basic" />
            </Route>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
