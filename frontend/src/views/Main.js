import React, { Component } from 'react';
import Tiles from './Tiles';
import PeopleListView from './PeopleListView.js'
import ProfileOverviewBasic from './ProfileOverviewBasic.js'
import ProfileOverviewDetailed from './ProfileOverviewDetailed.js'
import ProgressBar from './ProgressBar';
import SplitLayout from './SplitLayout';
import Images from '../assets';
import NetworkView from './NetworkView.js'
import {RightLinkTo} from '../LinkTo';

import {Button, BackNavBar} from './Buttons';

const WelcomeLeftScreen = (props) => (
<div className="WelcomeLeftScreen animated fadeIn">
  <img src={Images.logo} role="presentation" />
  <h1>Welcome, <span className="c-p">hackBack</span></h1>
  <strong>A risk management app for your company</strong>
  <p>
    Receive automated feedback on your employee's work satisfaction and their engagement.
    Analyze a combination of employee statistics to prevent burnout before it happens.
  </p>
  <RightLinkTo to="/overview/detailed"  state={{transition: 'slideLeft'}}>
    <Button>Show me more</Button>
  </RightLinkTo>
</div>
);

const WelcomeOverviewBasic = () => (
  <div className="WelcomeOverviewBasic dark-theme animated fadeIn">
    <ProgressBar progress="63" infoText="Overall risk" additionalClass="animated fadeInRight" />
  </div>
);

const WelcomeOverviewDetailed = () => (
  <div className="WelcomeOverviewDetailed animated fadeIn">
    <Tiles tiles={[
      {
        name: 'Employee risks',
        renderContent: () => <ProgressBar progress="42" colored reverseColor />,
        link: "/left/employees/basic/right/employees/detailed",
      },
      {
        name: 'Project risks',
        renderContent: () => <ProgressBar progress="14" colored reverseColor />,
        link: "/left/employees/basic/right/employees/detailed",
      },
      {
        name: 'Client risks',
        renderContent: () => <ProgressBar progress="20" colored reverseColor />,
        link: "/left/employees/basic/right/employees/detailed",
      },
      {
        name: 'Interaction quality',
        renderContent: () => <ProgressBar progress="62" colored />,
        link: "/left/employees/basic/right/employees/detailed",
      },
      {
        name: 'Company mood',
        renderContent: () => <ProgressBar progress="28" colored />,
        link: "/left/employees/basic/right/employees/detailed",
      },
      {
        name: 'Black box score',
        renderContent: () => <div className="tile-main-text">12p.</div>,
        link: "/left/employees/basic/right/employees/detailed",
      }
    ].map((t, ind) => {
      t.icon = Images.icons.artboards[ind];
      return t;
    })} />
  </div>
);


const EmployeeOverviewBasic = () => (
  <div className="EmployeeOverviewBasic dark-theme animated fadeIn">
    <ProgressBar progress="42" infoText="Employee risks" additionalClass="animated fadeInUp" />
  </div>
);

const EmployeeOverviewDetailed = () => (
  <div className="EmployeeOverviewDetailed animated fadeIn">
    <Tiles link="/left/people/basic/right/people/detailed" tiles={[
      {
        name: 'Interactions',
        renderContent: () => <ProgressBar progress="42" colored />,
      },
      {
        name: 'Happiness',
        renderContent: () => <ProgressBar progress="56" colored />
      },
      {
        name: 'Cost per hire',
        renderContent: () => <div className="tile-main-text">4k $</div>
      },
      {
        name: 'Client risks',
        renderContent: () => <ProgressBar progress="20" colored reverseColor />
      },
      {
        name: 'Time to fill',
        renderContent: () => <div className="tile-main-text">17 days</div>
      },
      {
        name: 'Turnover cost',
        renderContent: () => <div className="tile-main-text">40k $</div>
      },
      {
        name: 'Employees in risk',
        renderContent: () => <div className="tile-main-text colspan-2">21 employees</div>,
        tileClass: 'colspan-2'
      },
      {
        name: 'Avg length',
        renderContent: () => <div className="tile-main-text">783 days</div>
      }
    ].map((t, ind) => {
      t.icon = Images.icons.artboards[ind%6];
      return t;
    })} />
  </div>
);

const rands=[15,63,23,30,16,42,21,51,8,35,73,46,24,48,41,      32,42,19,       25,27,5,56,47,15,43,43,10,62,39,35,21,30,28,14,18,30,27,10,34,52,26,28,9,39,54,37,10,10,15,31,32,37,20,51,16,39,62,44,9,56,53,48,9,60,26,5,33,35,38,9,56,13,34,22,45,23];

const renderPeopleListItem = (ind, va, vb, vc) => (
  <div className="person-combo">
    <ProgressBar progress={va || rands[ind*3]} noText colored />
    <ProgressBar progress={vb || rands[ind*3 + 1]} noText colored reverseColor />
    <ProgressBar progress={vc || rands[ind*3 + 2]} noText colored reverseColor />
    <img src={Images.people[ind]} role="presentation" className="PeopleListViewItem" />
  </div>
);

const PeopleOverviewBasic = () => (
  <div className="PeopleOverviewBasic dark-theme animated fadeIn">
    <div className="tile-main-text">Risks per person</div>
  </div>
);

const Main = {
  NetworkView,
  PeopleOverviewBasic,
  PeopleListView,
  ProfileOverviewBasic,
  ProfileOverviewDetailed,
  WelcomeLeftScreen,
  WelcomeOverviewBasic,
  WelcomeOverviewDetailed,
  EmployeeOverviewBasic,
  EmployeeOverviewDetailed,
}

export default Main;
