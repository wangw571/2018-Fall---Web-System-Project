import React, { Component, Fragment } from 'react';
import { Page } from '../containers';
import '../styles/containers/profile.scss';
import { OrganizationInfo } from '../util/OrganizationInfo';
import { List } from '../components/dashboard';
import { Modal } from '../components';

const org = OrganizationInfo.getInstance();

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: {
        text: ''
      },
      last_name: {
        text: ''
      },
      password: {
        text: ''
      },
      confirm_password: {
        text: ''
      },
      email: {
        text: ''
      },
      id: {
        text: ''
      },
      admin: {
        text: ''
      },
      hidden: org.getOrganizationType() === "TEQ"? false: true,
      items: org.getOrganizationsList(),
      active: 0,
      show: false,
      templates: org.getTemplates(),
      users: org.getUsers()
    }
  }

  componentDidMount = async el => {
    if (this.state.hidden === false){
      let orgs = org.getOrganizationsList();
      console.log(orgs);
      this.setState({
        items: orgs
      });
    } else {
      let users = org.getUsers();
      console.log(users);
        this.setState({
          items: users
        });
    }
  }
  setActive = active => this.setState({ active })
  click = key => this.setState({ active: key })

  itemMap = ({ name }) => {

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

  removeOrg = async () => {
    const active = this.state.active;
    let value = this.state.items[active];
    let err;
    if (this.state.hidden === false){
      err = await org.removeOrganization(value.name, value.id);
    } else {
      err = await org.removeUser(value.first_name, value.last_name, value.email, value.id);
    }
    if (err) {
      console.log(err);
      return
    }
    this.close();
  }

  update = ({ target }) => {
    const name = target.name;
    const text = target.value;
    this.setState({
        [name]: {
        text
        }
    });
    }

  submit = async el => {
    el.preventDefault();
    const { first_name, last_name, email, id, password, confirm_password, items } = this.state;
    let valid = password.text === confirm_password.text;
    if (valid){
      const { err } = await org.addUser(first_name.text, last_name.text, email.text, id.text, password.text);
      // adding the organization in the list. However, if the component mount is called when we submit, we dont have to do this
      const newItems = items.map((item) => ({ ...item }));
      newItems.push({first_name: first_name.text, last_name: last_name.text, email: email.text, id:id.text, password: password.text});
      this.setState({ newItems });
      if (err) {
        console.log(err);
        return
      }
    }
}

  render() {
    const { items, active, show } = this.state;
      return (
        <Page className='profile'>
          <div className="profile__container">
            <List block="profile" onClick={this.click} active={active} items={items} map={this.itemMap}>
                <div className="profile__list-header">
                Organizations
                </div>
            </List>
          </div>
          <div className="profile__page">
            <form className="profile__form" onSubmit={this.submit}>
              <h1 className="profile__input-title">
                  Organization ID
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="id"
                  placeholder={org.getOrganizationID(this.state.active)}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  First Name
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="username"
                  placeholder={org.getOrganizationUsername(this.state.active)}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Last Name
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="username"
                  placeholder={org.getOrganizationUsername(this.state.active)}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Email of the organization
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-envelope-square profile__icon"></i>
                  <input
                  type="email"
                  name="email"
                  placeholder={org.getOrganizationEmail(this.state.active)}
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Admin User? Enter True or False
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-envelope-square profile__icon"></i>
                  <input
                  type="text"
                  name="admin"
                  placeholder="Admin"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                Templates
              </h1>
              <select className="profile__input-group" itemMap={this.state.templates} onChange={this.options}>
                {this.state.templates.map((e, key) => {
                return <option key={key}>{e.name}</option>
                 })}
              </select>
              <h1 className="profile__input-title">
                Users
              </h1>
              <select className="profile__input-group" itemMap={this.state.users} onChange={this.options}>
                {this.state.users.map((e, key) => {
                return <option key={key}>{e.name}</option>
                 })}
              </select>
              <h1 className="profile__input-title">
                  Password
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-key profile__icon"></i>
                  <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Confirm Password
              </h1>
              <div className={`profile__input-group`}>
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
