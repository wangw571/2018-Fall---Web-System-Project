import React, { Component } from 'react';
import '../styles/containers/addAccount.scss';
import { withRouter } from 'react-router-dom';
import { Page } from '../containers';
import { Authentication } from '../util';

const auth = Authentication.getInstance();
class _AddAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: {
            text: '',
            valid: true
          },
          password: {
            text: '',
            valid: true
          },
          confirmPassword: {
              text: '',
              valid: true
          },
          email: {
              text: '',
              valid: true
          }
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
          const token = auth.login(username.text, password.text);
          if (token) {
            const search = this.getQuery(window.location.search);
            if (search.redirect) {
              this.props.history.push(search.redirect);
            } else {
              this.props.history.push("/app/profile");
            }
          }
        }
      }
    
      update = ({ target }) => {
        const name = target.name;
        const text = target.value;
        let valid = null;
        let validText = null;
        switch(name) {
          case "username":
            validText = new RegExp('[A-Za-z]([A-Za-z]*[0-9]*)+');
            console.log(text);
            console.log(validText.test(text));
            if (validText.test(text)){
                valid = true;
            } else {
                valid = false;
            }
            break;
          case "password":
            validText = new RegExp("([A-Za-z]*[0-9]*)+");
            if (validText.test(text)){
                valid = true;
            } else {
                valid = false;
            }
            break;
          case "confirm_password":
                valid = this.state.password.text === text;
            break;
          case "email":
            validText = new RegExp("\w+@[A-Za-z]+\.[a-zA-Z]+");
            if (validText){
                valid = true;
            } else {
                valid = false;
                }
            break;
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
        text === ""? "": ` addAccount__input-group--${ valid? "": "in" }valid`
      )

  render() {
    const { username, password, confirmPassword, email } = this.state;
    return (
        <Page className="addAccount">
            <div className="addAccount__title">
                Add Account
            </div>
            
            <form className="addAccount__form" onSubmit={this.authenticate} >
                <div className="addAccount__input-title">
                    Please enter the username for the organization.
                </div>
                <div className={`addAccount__input-group${this.validClass(username)}`}>
                    <i className="fas fa-user addAccount__icon"></i>
                    <input
                    type="text"
                    name="username"
                    defaultValue=""
                    placeholder="Username"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Please enter the email of the organization.
                </div>
                <div className={`addAccount__input-group${this.validClass(email)}`}>
                    <i className="fas fa-envelope-square addAccount__icon"></i>
                    <input
                    type="text"
                    name="email"
                    defaultValue=""
                    placeholder="Email"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className="addAccount__input-title">
                    Please create a temporary password for the organization which they will change later.
                </div>
                <div className={`addAccount__input-group${this.validClass(password)}`}>
                    <i className="fas fa-key addAccount__icon"></i>
                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <div className={`addAccount__input-group${this.validClass(confirmPassword)}`}>
                    <i className="fas fa-key addAccount__icon"></i>
                    <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    onChange={this.update}
                    className="addAccount__input"
                    />
                </div>
                <button 
                type="submit"
                className="addAccount__button"
                >
                    Register
                </button>
            </form>
        </Page>
    )
  }
}

export const AddAccount = withRouter(_AddAccount);
