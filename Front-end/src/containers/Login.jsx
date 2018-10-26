import React, { Component } from 'react';
import '../styles/containers/login.scss';
import { Dashboard } from './Dashboard';
import { Route } from 'react-dom';
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
    this.state = {
      toDashboard: false,
    }
  }

  authenticate = el => {
    el.preventDefault();
    if (this.state.username.valid === true && this.state.password.valid === true){
      console.log("WEEEEEE");
      this.setState({
        toDashboard: true
      });
    }
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
    if (this.state.toDashboard === true) {
      return (<Route path="/Dashboard" Component={Dashboard}/>)
    }
    return (
      <main className="login">
        <form className="login__form" onSubmit={this.authenticate} >
          <div className="login__app-name">
              GreenCare
          </div>
          <div className={`login__input-group${this.validClass(username)}`}>
            <i className="fas fa-user login__icon"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.update}
              className="login__input"
            />
          </div>
          <div className={`login__input-group${this.validClass(password)}`}>
            <i className="fas fa-key login__icon"></i>
            <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.update}
            className="login__input"
            />
          </div>
          <button 
          type="submit"
          className="login__button"
          >
            Login
          </button>
        </form>
      </main>
    )
  }
}