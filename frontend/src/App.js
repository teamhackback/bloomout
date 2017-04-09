import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import Main from './views/Main.js'
import EmailForm from './views/EmailForm.js'
import DebugView from './views/DebugView.js'
import Styles from './views/SplitLayout.css';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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
    component: Main.EmployeeOverviewBasic
  },
  {
    path: "/employees/detailed",
    component: Main.EmployeeOverviewDetailed
  },
  {
    path: "/people/basic",
    component: Main.PeopleOverviewBasic
  },
  {
    path: "/people/detailed",
    component: Main.PeopleListView
  },
  {
    path: "/profile/:id/basic",
    component: Main.ProfileOverviewBasic,
  },
  {
    path: "/profile/:id/detailed",
    component: Main.ProfileOverviewDetailed,
  },
  {
    path: "/network",
    component: Main.NetworkView
  },
];

routes.forEach((e, i) => {
  e.id = i;
});

class SplitScreen extends Component {

  render() {
  let transitionName = "slideLeft";
  if (this.props.location !== undefined && this.props.location.state !== undefined) {
    transitionName = this.props.location.state.transition;
  }
  console.log(transitionName);
  const props = this.props;
  return (
    <ReactCSSTransitionGroup
            transitionName={transitionName}
            transitionEnterTimeout={3000}
            transitionLeaveTimeout={3000}
    >
    <div className={Styles.SplitLayout}>
        <div className={Styles.SplitPane}>
        <Switch>
          { routes.map(route => <Route key={route.id} location={props.location} path={"/left" + route.path} component={route.component} /> )}
            <Route location={props.location} path="/" exact>
              <Redirect to="/left/overview/intro/right/overview/basic" />
            </Route>
        </Switch>
      </div>
      <div className={Styles.SplitPane}>
        <Switch>
          { routes.map(route => <Route key={route.id} path={"/left/(.*)/right" + route.path} component={route.component} location={this.location}/> )}
        </Switch>
      </div>
    </div>
    </ReactCSSTransitionGroup>
  )
  };
};

const SplitScreenWithRouter = withRouter(SplitScreen);

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <Switch>
            <Route path="/network" component={Main.Network} />
            <Route path="/form" component={EmailForm} />
            <Route path="/debug" component={DebugView} />
            <Route path="/" component={SplitScreenWithRouter} />
          </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
