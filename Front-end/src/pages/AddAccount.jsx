import React, { Component, Fragment } from 'react';
import { Page, App } from '../containers';
import '../styles/containers/addAccount.scss';
import { Authentication} from '../util';
import { OrganizationInfo } from '../util/OrganizationInfo';
import { List, Section } from '../components/dashboard';
import { Modal } from '../components';

const org = OrganizationInfo.getInstance();
const auth = Authentication.getInstance();

const MAX_SIZE = 120;
export class AddAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: {
        text: '',
        valid: false
      },
      lastName: {
        text: '',
        valid: false
      },
      password: {
        text: '',
        valid: false
      },
      confirmPassword: {
        text: '',
        valid: false
      },
      email: {
          text: '',
          valid: false
      },
      name: {
          text: '',
          valid: false
      },
      tempForm: 0,
      templates: org.getTemplates(),
      users: org.getUsers()

    }
  }

  componentDidMount() {
  }

  toggleModal = state => this.setState(({show}) => ({
    show: state? state: !show
  }))

  close = () => {
    this.toggleModal(false);
  }

  validClass = ({ text, valid }) => (
    text === ""? "": ` profile__input-group--${ valid? "": "in" }valid`
  )
  
  update = ({ target }) => {
    const name = target.name;
    const text = target.value;
    let valid = false;
    let validText = null;
    switch(name) {
        case "name":
            validText = new RegExp("[A-Za-z0-9]{6,}");
            if (validText.test(text)){
                valid = true;
            }
            valid = true;
            break;
        case "username":
            validText = new RegExp("[A-Za-z0-9]{6,}");
            if (validText.test(text)){
                valid = true;
            }
            valid = true;
            break;
        case "password":
            validText = new RegExp("([A-Za-z]+[0-9]+[A-Za-z]*)+");
            if (validText.test(text)){
                valid = true;
            }
            valid = true;
            break;
        case "confirm_password":
            valid = this.state.password.text === text || true;
            console.log(this.state.password.text);
            console.log(text);
            console.log(valid);
            break;
        case "email":
            validText = new RegExp("[A-Za-z0-9]+@[A-Za-z]+\.[a-zA-Z]+");
            if (validText){
                valid = true;
            }
            valid = true;
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

  submit = el => {
    el.preventDefault();
    const { firstName, lastName, email, name, password, confirmPassword, items } = this.state;
    let valid = password.valid && firstName.valid && lastName.valid && email.valid && name.valid && confirmPassword.valid;
    if (valid || true){
      org.addOrganization(firstName.text, lastName.text, email.text, name.text, password.text).then(() => {
        const newItems = items.map((item) => ({ ...item }));
        newItems.push({firstName: firstName.text, lastName: lastName.text, email: email.text, name:name.text, password: password.text});
        this.setState({ newItems });
      }).catch(err => {
        console.log(err);
      });
    }
}

  render() {
    const { firstName, lastName, password, confirmPassword, email, name } = this.state;
      return (
        <Page className='profile'>
          <div className="profile__page">
            <form className="profile__form" onSubmit={this.submit}>
              <div className="profile__input-title">
                  Organization
              </div>
              <div className={`profile__input-group${this.validClass(name)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  First Name
              </div>
              <div className={`profile__input-group${this.validClass(firstName)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="firstName"
                  placeholder="first name"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Last Name
              </div>
              <div className={`profile__input-group${this.validClass(lastName)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="lastName"
                  placeholder="last name"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Email of the organization
              </div>
              <div className={`profile__input-group${this.validClass(email)}`}>
                  <i className="fas fa-envelope-square profile__icon"></i>
                  <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Password
              </div>
              <div className={`profile__input-group${this.validClass(password)}`}>
                  <i className="fas fa-key profile__icon"></i>
                  <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Confirm Password
              </div>
              <div className={`profile__input-group${this.validClass(confirmPassword)}`}>
                  <i className="fas fa-key profile__icon"></i>
                  <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <button 
              className="profile__button">
                  Submit
              </button>
            </form>
          </div>
        </Page>)
    }
  }
