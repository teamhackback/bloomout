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

export class RightLinkTo extends Component {
  render() {
    const {
      to,
      children,
      ...other
    } = this.props;
    const pathname = `/left${getRightPart()}/right${to}`;
    const toObj = {
      pathname: pathname
    };
    if (other.state !== undefined) {
      toObj.state = other.state
    }
    console.log("link", toObj);
    return (
      <Link to={toObj}>
        { children }
      </Link>
    );
  }
};

export class LeftLinkTo extends Component {
  render() {
    const to = `/left${this.props.to}/right${getLeftPart()}`;
    return (
      <Link to={to}>
        { this.props.children }
      </Link>
    );
  }
};

export class LinkTo extends Component {
  render() {
    const to = `/left${this.props.left}/right/${this.props.right}`;
    return (
      <Link to={to}>
        { this.props.children }
      </Link>
    );
  }
};
