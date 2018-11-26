import React, { Component } from 'react';
import '../styles/containers/login.scss';
import { withRouter } from 'react-router-dom';
import { Authentication } from '../util';
import { toast } from 'react-toastify';

class _Login extends Component {

  constructor(props) {
    super(props);
    this.auth = Authentication.getInstance();
  }

  checkEmail = text => (
    text.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  )

  checkPassword = text => (
    text.length >= 4
  )

  state = {
    username: { text: '', valid: null, check: this.checkEmail },
    password: { text: '', valid: null, check: this.checkPassword }
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

  authenticate = async el => {
    el.preventDefault();
    const { username, password } = this.state; 
    if (username.valid && password.valid){
      const { err } = await this.auth.login(username.text, password.text);
      if (err) {
        console.log("Invalid email/password");
        toast.error("Invalid email/password");
        return
      }
      const { redirect } = this.getQuery(window.location.search);
      this.props.history.push(redirect? redirect: '/app/upload');
    } 
  }

  update = async ({ currentTarget: { name, value } }) => {
    this.setState(state => ({
      [name]: {
        ...state[name],
        valid: value === ''? null: state[name].check(value),
        text: value
      },
    }))
  }

  validClass = ({ text, valid }) => (
    text === ''? '': ` login__input-group--${ valid? "": "in" }valid`
  )

  render() {
    const { username, password } = this.state;
    return (
      <main className="login">
        <form className="login__form" onSubmit={this.authenticate} >
          <h1 className="login__app-name">
              GreenCare
          </h1>
          <div className={`login__input-group${this.validClass(username)}`}>
            <i className="fas fa-user login__icon"></i>
            <input
              type="email"
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