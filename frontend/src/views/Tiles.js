import React, { Component } from 'react';
import {
  withRouter
} from 'react-router-dom';

class Tiles extends Component {
  render() {
    // const colors = ['#A4A4A4', "#727272", "#B7B7B7", "#918E8E", "#606060", "#4D4D4D"];
    const renderIconElement = (src) => (
      <img src={src} role="presentation" className="icon"/>
    );
    return (
      <div className={`tiles ${this.props.whiteTheme ? "white-theme" : "dark-theme"}`}>
        {this.props.tiles.map((tile, ind) => (
          <div key={ind}
            className={`tile animated fadeIn ${tile.tileClass || ""}`}
            onClick={() => {
              let link = tile.id !== undefined ? this.props.link + "/" + tile.id : this.props.link;
              console.log(tile.link);
              this.props.history.push(tile.link || link);
            }}
            style={{
              background: this.props.whiteTheme ? "#fff" : '#333F49',
              animationDelay: `${100*ind}ms`
            }}>
            {tile.renderContent()}
            <span className="title">{tile.name}</span>
            {tile.icon ? renderIconElement(tile.icon): ""}
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(Tiles);
