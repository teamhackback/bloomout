import React, { Component } from 'react';
import PBar from 'progressbar.js';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.id = "progress-" + Math.floor(Math.random() * 100000);
  }

  componentDidMount() {
    const infoText = this.props.infoText ? (this.props.infoText + "<br />") : "";
    this.bar = new PBar.Circle(`#${this.id}`, {
      color: '#fff',
      strokeWidth: 7,
      trailWidth: 5,
      trailColor: this.props.colored ?'#7D7D7D' : '#ddd',
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: { color: this.props.colored ? '#5CB85C' : '#1976d2' },
      to: { color: this.props.colored ? '#D9534F' : '#1976d2' },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        const value = Math.round(circle.value() * 100);
        circle.setText(infoText + value + "%");
      }
    });
    this.bar.path.style.strokeLinecap = "round";
    const progress = this.props.progress;
    this.bar.animate(progress > 1 ? progress / 100 : progress);  // Number from 0.0 to 1.0
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