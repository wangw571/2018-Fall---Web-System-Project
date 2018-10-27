import React, { Component } from 'react';
import '../styles/containers/login.scss';
import { withRouter } from 'react-router-dom';
import { Authentication } from '../util';

class _Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: {
        text: '',
        valid: null
      },
      password: {
        text: '',
        valid: null
      }
    }
  }

  componentOnMount() {
    const search = this.getQuery(window.location.search);
    if (search.redirect) {
      this.props.history.push(search.redirect);
    }
  }

  getQuery = search => {
    const res = {};
    if (search && search !== "") {
      search.slice(1).split("&").forEach(el => {
        const item = el.split("=");
        res[item[0]] = item[1];
      });
    }
    return res;
  }

  authenticate = el => {
    el.preventDefault();
    const { username, password } = this.state; 
    if (username.valid === true && password.valid === true){
      const token = Authentication.login(username.text, password.text);
      if (token) {
        const search = this.getQuery(window.location.search);
        if (search.redirect) {
          this.props.history.push(search.redirect);
        } else {
          this.props.history.push("/app/upload");
        }
      } else { console.log(token.error) }
    }
  }

  update = ({ target }) => {
    const name = target.name;
    const text = target.value;
    let valid = null;
    switch(name) {
      case "username":
        valid = Authentication.isValidUsername(text);
      case "password":
        valid = Authentication.isValidPassForUser(text);
      default:
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

export const Login = withRouter(_Login);
