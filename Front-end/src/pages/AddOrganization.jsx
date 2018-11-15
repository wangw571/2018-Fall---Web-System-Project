import React, { Component } from 'react';
import { Page } from '../containers';
import '../styles/containers/profile.scss';
import { OrganizationInfo } from '../util/OrganizationInfo';

const org = OrganizationInfo.getInstance();

export class AddOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: {
          text: ''
      },
      name: {
          text: ''
      },
      services: {
          text: ''
      }
    }
  }

  componentDidMount() {
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
    }

  submit = async el => {
    el.preventDefault();
    const { name, id, services } = this.state;
    var servicesArr = services.text.split(" ");
    const { err } = await org.addOrganization(id, name, servicesArr);
    if (err) {
        console.log(err);
        return
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
              <div className={"profile__input-group"}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="id"
                  placeholder="Organization ID"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Name
              </h1>
              <div className={"profile__input-group"}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={this.update}
                  className="profile__input"
                  />
              </div>
              <h1 className="profile__input-title">
                  Services (Seperate them by spaces)
              </h1>
              <div className={"profile__input-group"}>
                  <i className="fas fa-user profile__icon"></i>
                  <input
                  type="text"
                  name="services"
                  placeholder="Services"
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
