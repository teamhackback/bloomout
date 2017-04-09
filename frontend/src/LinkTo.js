import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';


const leftRe = /left\/(.*)\/right/
const rightRe = /left\/(.*)\/right\/(.*)/

export const getLeftPart = function() {
  const found = document.location.pathname.match(leftRe);
  if (found.length > 1)
    return "/" + found[1];
}

export const getRightPart = function() {
  const found = document.location.pathname.match(rightRe);
  if (found.length > 1)
    return "/" + found[2];
}

export default class CustomLinkTo extends Component {
  render() {
    const left = getRightPart();
    const to = `/left${left}/right${this.props.to}`;
    return (
      <Link to={to}>
        { this.props.children }
      </Link>
    );
  }
};
