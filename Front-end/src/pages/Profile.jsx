import React, { Component, Fragment } from 'react';
import { Page, App } from '../containers';
import '../styles/containers/profile.scss';
import { Authentication} from '../util';
import { OrganizationInfo } from '../util/OrganizationInfo';
import { List, Section } from '../components/dashboard';
import { Modal } from '../components';

const org = OrganizationInfo.getInstance();

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: {
        text: '',
        valid: false
      },
      password: {
        text: '',
        valid: false
      },
      hidden: org.getOrganizationType() === "TEQ"? false: true,
      items: org.getOrganizationsList(),
      active: 0,
      show: false,
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
      tempForm: 0

    }
  }

  componentDidMount() {
    
  }
  setActive = active => this.setState({ active })
  click = key => this.setState({ active: key })

  itemMap = ({ username, email, name }) => {
    return <Fragment>
      <p className="profile__item-status">{name}</p>
      <button className="profile__delete-org"
      onClick={this.toggleModal}>
        Remove
      </button>
    </Fragment>
  }

  toggleModal = state => this.setState(({show}) => ({
    show: state? state: !show
  }))

  close = () => {
    this.toggleModal(false);
  }

  removeOrg = () => {
    const active = this.state.active;
    org.removeOrganization(active);
    this.close();
  }

  validClass = ({ text, valid }) => (
    text === ""? "": ` profile__input-group--${ valid? "": "in" }valid`
  )
  
  addAccount = () => {
    this.setState({
      tempForm : 1 })
  }
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
            break;
        case "username":
            validText = new RegExp("[A-Za-z0-9]{6,}");
            if (validText.test(text)){
                valid = true;
            }
            break;
        case "password":
            validText = new RegExp("([A-Za-z]+[0-9]+[A-Za-z]*)+");
            if (validText.test(text)){
                valid = true;
            }
            break;
        case "confirm_password":
            valid = this.state.password.text === text;
            console.log(this.state.password.text);
            console.log(text);
            console.log(valid);
            break;
        case "email":
            validText = new RegExp("[A-Za-z0-9]+@[A-Za-z]+\.[a-zA-Z]+");
            if (validText){
                valid = true;
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
    console.log(this.state.confirmPassword.text);
    console.log(this.state.password.text);
    console.log(this.state.username.text);
    }

  submit = () => {
    const { username, email, name, password, confirmPassword, items } = this.state;
    let valid = password.valid && username.valid && email.valid && name.valid && confirmPassword.valid;
    if (valid){
      org.addOrganization(username.text, email.text, name.text, password.text);
      const newItems = items.map((item) => ({ ...item }));
      newItems.push({username: username.text, email: email.text, name:name.text, password: password.text});
      this.setState({ newItems });
    }
}

  render() {
    const { items, active, show } = this.state;
    const { username, password, confirmPassword, email, name } = this.state;
    if (this.state.hidden === false){
      return (
        <Page className='profile'>
          <div className="profile__container">
          <button className='profile__addAccount-button'onClick={this.addAccount}>
              Add Account
          </button>
          <List block="profile" onClick={this.click} active={active} items={items} map={this.itemMap}>
            <div className="profile__list-header">
              Organizations
            </div>
          </List>
          </div>
          <div className="profile__page">
            <form className="profile__form" onSubmit={this.submit}>
              <div className="profile__input-title">
                  Name for the organization
              </div>
              <div className={`profile__input-group${this.validClass(name)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="name"
                  placeholder={this.state.tempForm === 0? org.getOrganizationName(this.state.active) : "Name"}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Username for the organization
              </div>
              <div className={`profile__input-group${this.validClass(username)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="username"
                  placeholder={this.state.tempForm === 0? org.getOrganizationUsername(this.state.active) : "Username"}
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
                  placeholder={this.state.tempForm === 0? org.getOrganizationEmail(this.state.active) : "Email"}
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
          <Modal show={show} className="upload__modal" close={this.close}>
            <div>
              Are you sure you want to delete the organization?
              <button onClick={this.removeOrg} className="upload__button upload__button--submit">
                Delete
              </button>
              <button onClick={this.close} className="upload__button upload__button--exit">
                Exit
              </button>
            </div>
          </Modal>
        </Page>)
    } else {
      return (
        <Page className='profile'>
          <div className="profile__page">
            <form className="profile__form" onSubmit={this.submit}>
              <div className="profile__input-title">
                  Name for the organization
              </div>
              <div className={`profile__input-group${this.validClass(name)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="name"
                  placeholder={this.state.tempForm === 0? org.getOrganizationName(this.state.active) : "Name"}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <div className="profile__input-title">
                  Username for the organization
              </div>
              <div className={`profile__input-group${this.validClass(username)}`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="username"
                  placeholder={this.state.tempForm === 0? org.getOrganizationUsername(this.state.active) : "Username"}
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
                  placeholder={this.state.tempForm === 0? org.getOrganizationEmail(this.state.active) : "Email"}
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
          <Modal show={show} className="upload__modal" close={this.close}>
            <div>
              Are you sure you want to delete the organization?
              <button onClick={this.removeOrg} className="upload__button upload__button--submit">
                Delete
              </button>
              <button onClick={this.close} className="upload__button upload__button--exit">
                Exit
              </button>
            </div>
          </Modal>
        </Page>)
    }
    
    }
  }
