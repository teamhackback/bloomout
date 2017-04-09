import React, { Component } from 'react';

export const Button = (props) => (
  <a className="button" href="#" {...props}>{props.children}<span></span></a>
);

export const BackNavBar = (props) => (
  <div className="back-navbar">
    <a href="#" onClick={() => window.history.back() }>&larr; Back</a>
  </div>
);
