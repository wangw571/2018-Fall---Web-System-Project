import React, { Component } from 'react';
import { Page, App } from '../containers';
import '../styles/containers/profile.scss';
import { Authentication} from '../util';
import { OrganizationInfo } from '../util/OrganizationInfo';
import { AddAccount } from './AddAccount';

const org = OrganizationInfo.getInstance();
const auth = Authentication.getInstance();

export class Profile extends Component {
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
      },
      hidden: org.getOrganizationType() === "TEQ"? false: true,
      name: "Register"
    }
  }

  setName = ({ buttonName }) => {
    this.setState({
      name: buttonName
    });
    this.addAccountorEdit();
  }

  addAccountorEdit = () => {
    this.props.history.push("/app/addAccount");
  }

  render() {
    if (this.state.hidden){
      return (
        <Page className='profile'>
          <form className="profile__form">
            <div className="profile__organization-info">
              Organization Name: <br/>
              Username: <br/>
              Email: <br/>
            </div>
            <div className="profile__input-group">
              <button 
                className="profile__button-change-pass"
                onClick={this.addAccountorEdit}
                >
                  <i className="fas fa-edit profile__icon"></i>
              </button>
            </div>
          </form>
        </Page>
      )
    } else {
    return (
    <Page className='profile'>
      <form className="profile__form">
        <div className="profile__organization-info">
          Organization Name: <br/>
          Username: <br/>
          Email: <br/>
        </div>

          <button 
            className="profile__button-change-pass"
            onClick={this.addAccountorEdit}
            >
              <i className="fas fa-edit profile__icon"></i>
          </button>
      </form>
      <div> 
          <button 
          className="profile__button-add-account"
          onClick={this.addAccountorEdit}>
            Add Account
          </button>
      </div>
    </Page>)
    }
  }
}