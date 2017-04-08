import React, { Component } from 'react';

class Tiles extends Component {
  render() {
    const colors = ['#A4A4A4', "#727272", "#B7B7B7", "#918E8E", "#606060", "#4D4D4D"];
    return (
      <div className="tiles dark-theme">
        {this.props.tiles.map((tile, ind) => (
          <div key={ind} className={`tile animated fadeIn`}
            style={{
              background: colors[ind],
              animationDelay: `${100*ind}ms`
            }}>
            {tile.renderContent()}
            <span className="title">{tile.name}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default Tiles;
