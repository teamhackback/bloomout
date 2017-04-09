import React, { Component } from 'react';
import PBar from 'progressbar.js';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.id = "progress-" + Math.floor(Math.random() * 100000);
  }

  getStrokeColor(value) {
    if (!this.props.colored) {
      return "#fff";
    }
    
    const cBlue = "#047CDA";
    const cOrange = "#FF8A00";
    const cRed = "#FF1800";
    let barColor = cOrange;
    if (value > 100 * 2 / 3) {
      barColor = this.props.reverseColor ? cRed : cBlue;
    } else if (value < 100/3) {
      barColor = this.props.reverseColor ? cBlue : cRed;
    }
    return barColor;
  }

  componentDidMount() {
    const infoText = this.props.infoText ? (this.props.infoText + "<br />") : "";
    const self = this;
    this.bar = new PBar.Circle(`#${this.id}`, {
      color: '#fff',
      strokeWidth: 4,
      trailWidth: 4,
      trailColor: this.props.colored ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      //from: { color: this.props.colored ? colBlue : "#fff" },
      //to: { color: this.props.colored ? colBlue : "#fff" },
      // Set default step function for all animate calls
      step: function(state, circle) {
        //circle.path.setAttribute('stroke', state.color);
        const value = Math.round(circle.value() * 100);
        if (!self.props.noText) circle.setText("<h1>"+ infoText + value + "%</h1>");
        circle.path.setAttribute('stroke', self.getStrokeColor(value));
      }
    });
    this.bar.path.style.strokeLinecap = "round";
    const progress = this.props.progress;
    this.bar.animate(progress / 100);  // Number from 0.0 to 1.0
  }

  componentDidUpdate() {
    const progress = this.props.progress;
    this.bar.animate(progress / 100);  // Number from 0.0 to 1.0
  }

  render() {
    return (
      <div id={this.id}
        className="progressBar"
        style={{ }}>
      </div>
    );
  }
}

export default ProgressBar;
