import React, { Component } from 'react';
import '../styles/containers/login.scss';

export class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: {
        text: "",
        valid: null
      },
      password: {
        text: "",
        valid: null
      }
    }
  }

  authenticate = el => {
    el.preventDefault();
    console.log("WEEEEEE");
  }

  update = ({ target }) => {
    const name = target.name;
    const text = target.value;
    let valid = null;
    switch(name) {
      case "username":
        if (text === "") { valid = null }
        else if (text === "bob") { valid = true }
        else { valid = false }
        break;
      case "password":
        if (text === "") { valid = null }
        else if (text === "wee") { valid = true }
        else { valid = false }
        break;
    }
    this.setState({
      [name]: {
        text, valid
      }
    });
  }

  validClass = ({ text, valid }) => (
    text === ""? "": ` login__input-group--${ valid? "": "in" }valid`
  )

  render() {
    const { username, password } = this.state;
    return (
      <main className="login">
        <form className="login__form" onSubmit={this.authenticate}>
          <div className={`login__input-group${this.validClass(username)}`}>
            <i className="fas fa-user login__icon"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.update}
              className="login__input login__input--name"
            />
          </div>
          <div className={`login__input-group${this.validClass(password)}`}>
            <i className="fas fa-key login__icon"></i>
            <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.update}
            className="login__input login__input--pass"
            />
          </div>
          <button type="submit"
          className="login__button"
          >
            Login
          </button>
        </form>
      </main>
    )
  }
}