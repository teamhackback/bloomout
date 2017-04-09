import React, {Component} from 'react'
import personStore from '../PersonStore';
import {observer} from "mobx-react";

import Select from 'react-select';

import {SERVER_API_URL} from '../config';

// Be sure to include styles at some point, probably during your bootstrapping
//import 'react-select/dist/react-select.css';

let people = [
  { value: 1, label: 'Mina Günther' },
  { value: 2, label: 'Isabella Brandt' },
  { value: 3, label: 'Leo Pohl' },
  { value: 4, label: 'Ben Otto' },
];
let bodies = ['You are awesome!', 'I was not happy with the results.',
'Tis but a scratch', 'This hovercraft is full of eels', 'I fart in your general' +
' direction', 'What is the air-speed velocity of an unladen swallow?']

const GRAVATAR_SIZE = 15;
const imgSize = 30;

const GravatarValue = React.createClass({
	propTypes: {
		children: React.PropTypes.node,
		placeholder: React.PropTypes.string,
		value: React.PropTypes.object
	},
	render () {
	  const value = this.props.value.value;
		return (
			<div className="Select-value" title={this.props.value.title}>
				<span className="Select-value-label">
          <div className="avatar-wrapper" style={{height: imgSize, width: imgSize, display: "inline-block"}}>
            <img src={SERVER_API_URL + "/images/" + value} style={{height: imgSize, width: imgSize}} />
          </div>
          <div style={{"fontSize": "18px", display: "inline-block", "verticalAlign": "top", "marginTop": 2, "marginLeft": 5}}>
			    		{this.props.children}
          </div>
				</span>
			</div>
		);
	}
});

const GravatarOption = React.createClass({
	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		isDisabled: React.PropTypes.bool,
		isFocused: React.PropTypes.bool,
		isSelected: React.PropTypes.bool,
		onFocus: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		option: React.PropTypes.object.isRequired,
	},
	handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	render () {
		let gravatarStyle = {
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle',
		};
	  const value = this.props.option.value;
		return (
			<div className={this.props.className}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				title={this.props.option.title}>
          <div className="avatar-wrapper" style={{height: imgSize, width: imgSize, display: "inline-block"}}>
            <img src={SERVER_API_URL + "/images/" + value} style={{height: imgSize, width: imgSize}} />
          </div>
          <div style={{"fontSize": "18px", display: "inline-block", "verticalAlign": "top", "marginTop": 2, "marginLeft": 5}}>
			    		{this.props.children}
          </div>
			</div>
		);
	}
});

//<Gravatar email={this.props.option.email} size={GRAVATAR_SIZE} style={gravatarStyle} />

@observer
class EmailForm extends Component {
  constructor(props) {
    super(props)

    // get random to and from
    let toPerson = people[Math.floor(Math.random() * people.length)]
    let fromPerson = people[Math.floor(Math.random() * people.length)]
    while (toPerson === fromPerson)
      fromPerson = people[Math.floor(Math.random() * people.length)]

    this.state = {
      to: toPerson.value, 
      from: fromPerson.value, 
      body: bodies[Math.floor(Math.random() * bodies.length)], 
    }
  }

  handleInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleToChange = (value) => {
    console.log("to", value);
    this.setState({"to": value})
  }

  handleFromChange = (value) => {
    console.log("from", value);
    this.setState({"from": value})
  }

  handleSubmit = (e) => {
    console.log(this.state)
    fetch('https://bloomout.hackback.tech/api/chat', {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(this.state)
    }).then(function(res){ console.log(res) })
      .catch(function(res){ console.log(res) })
    e.preventDefault()
    this.setState({body: ""});
  };

  handlePreset = (e, val) => {
    let body;
    switch(val) {
        case 1:
          body = "I have six locks on my door all in a row. When I go out, I lock every other one. I figure no matter how long somebody stands there picking the locks, they are always locking three.";
          break;
        case 2:
          body = "My therapist told me the way to achieve true inner peace is to finish what I start. So far I’ve finished two bags of M&Ms and a chocolate cake. I feel better already.";
          break;
        case 3:
          body = "Politics is supposed to be the second oldest profession. I have come to realize that it bears a very close resemblance to the first.";
          break;
      }
      this.setState({body: body});
    e.preventDefault()
  };
  formPreventDefault(e) {
    alert('here');  
    e.preventDefault();
  }

  render() {
    return (
      <div className="form-container">
        <div className="logo" style={{height: 10}}></div>
        <span className="banner">Message Simulator 2017</span>
        <form onSubmit={this.formPreventDefault}>
          <label htmlFor="from">From:</label>
          <Select
            class="dropdown-menu2"
            name="form-field-name"
            value={this.state.from}
            options={people}
            clearable={false}
            onChange={this.handleFromChange}
            valueComponent={GravatarValue}
            optionComponent={GravatarOption}
          />
          <label htmlFor="to">To:</label>
          <Select
            class="dropdown-menu2"
            name="form-field-name"
            value={this.state.to}
            options={people}
            clearable={false}
            onChange={this.handleToChange}
            valueComponent={GravatarValue}
            optionComponent={GravatarOption}
          />

          <label htmlFor="body">Message Presets:</label>
          <div className="button-wrapper">
            <button name="preset1" onClick={e => this.handlePreset(e, 1)}>Supportive</button>
            <button name="preset2" onClick={e => this.handlePreset(e, 2)}>Indignant</button>
            <button name="preset3" onClick={e => this.handlePreset(e, 3)}>Surprised</button>
          </div>
          <label htmlFor="body">Body:</label>
          <textarea name="body" value={this.state.body} onChange={this.handleInputChange} />
          <input type="submit" value="Send" onClick={this.handleSubmit} />
        </form>
      </div>
    )
  }
}

export default EmailForm;
