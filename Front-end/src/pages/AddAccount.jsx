import React, { Component } from 'react';
import { Page } from '../containers';
import '../styles/containers/profile.scss';
import { OrganizationInfo } from '../util/OrganizationInfo';

const org = OrganizationInfo.getInstance();
export class AddAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: {
        text: ''
      },
      lastName: {
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
      name: {
          text: ''
      },
      admin: {
          text: ''
      },
      tempForm: 0,
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
  
  update = ({ currentTarget }) => {
    const name = currentTarget.name;
    const text = currentTarget.value;
    console.log(text);
    this.setState({
        [name]: {
        text
        }
    });
    console.log(name);
    console.log(this.state.name);
    console.log(this.state.firstName);
    console.log(this.state.lastName);
    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.confirm_password);
    }

  submit = async el => {
    el.preventDefault();
    const { firstName, lastName, email, name, password, confirm_password, items, admin } = this.state;
    let valid = password.text === confirm_password.text;
    if (valid){
        const { err } = await org.addUser(firstName.text, lastName.text, email.text, admin.text, name.text, password.text);
        if (err) {
            console.log(err);
            return
        }
        const newItems = items.map((item) => ({ ...item }));
        newItems.push({firstName: firstName.text, lastName:lastName.text, email: email.text, admin: admin.text, name:name.text, password: password.text});
        this.setState({ newItems });
    }
    
}

  render() {
      return (
        <Page className='profile'>
          <div className="profile__page">
            <form className="profile__form" onSubmit={this.submit}>
              <h1 className="profile__input-title">
                  Organization ID
              </h1>
              <div className={`profile__input-group`}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="name"
                  placeholder="Organization ID"
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
                  name="firstName"
                  placeholder="First Name"
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
                  name="lastName"
                  placeholder="Last Name"
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
                  placeholder="Email"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                Admin user? Enter True or False
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
        </Page>)
    }
  }
