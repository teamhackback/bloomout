import React, {Component} from 'react'

let people = ['Michael', 'John', 'Graham']
let bodies = ['You are awesome!', 'I was not happy with the results.',
'Tis but a scratch', 'This hovercraft is full of eels', 'I fart in your general' +
' direction', 'What is the air-speed velocity of an unladen swallow?']

class EmailForm extends Component {
  constructor(props) {
    super(props)

    // get random to and from
    let toPerson = people[Math.floor(Math.random() * people.length)]
    let fromPerson = people[Math.floor(Math.random() * people.length)]
    while (toPerson === fromPerson)
      fromPerson = people[Math.floor(Math.random() * people.length)]

    this.state = {
      to: toPerson, 
      from: fromPerson, 
      body: bodies[Math.floor(Math.random() * bodies.length)], 
    }
  }

  handleInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    console.log(this.state)
    fetch('https://leap.hackback.tech/api/chat', {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(this.state)
    }).then(function(res){ console.log(res) })
      .catch(function(res){ console.log(res) })
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="from">From:</label>
          <select value={this.state.from} onChange={this.handleInputChange} name="from">
            <option value="Michael">Michael</option>
            <option value="John">John</option>
            <option value="Graham">Graham</option>
          </select>
          <label htmlFor="to">To:</label>
          <select value={this.state.to} onChange={this.handleInputChange} name="to">
            <option value="Michael">Michael</option>
            <option value="John">John</option>
            <option value="Graham">Graham</option>
          </select>
          <label htmlFor="body">Body:</label>
          <textarea name="body" value={this.state.body} onChange={this.handleInputChange} />
          <input type="submit" value="Send" />
        </form>
      </div>
    )
  }
}

export default EmailForm;
