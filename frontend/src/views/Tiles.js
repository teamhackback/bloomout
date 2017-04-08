import React, { Component } from 'react';

class Tiles extends Component {
  render() {
    // const colors = ['#A4A4A4', "#727272", "#B7B7B7", "#918E8E", "#606060", "#4D4D4D"];
    
    const renderIconElement = (src) => (
      <img src={src} role="presentation" className="icon"/>
    );

    return (
      <div className="tiles dark-theme">
        {this.props.tiles.map((tile, ind) => (
          <div key={ind} className={`tile animated fadeIn`}
            style={{
              background: '#333F49',
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

export default Tiles;
