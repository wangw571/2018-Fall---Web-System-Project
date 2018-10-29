import React, { Component } from 'react';
import { Page } from '../containers';
import '../styles/containers/profile.scss';

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
      }
    }
  }

  addAccount = el => {
    this.props.history.push("/app/addAccount");
  }

  render() {
    return (<Page className='profile'>
      Profile
      <form className="profile__form-change-password">
        Change Password
      </form>
      <form className="profile__form-add-account">
        <div className="profile__organization-info">
          Organization's name
        </div>
        <button 
        className="profile__button-add-account"
        onClick={this.addAccount}>
          Add Account
        </button>
      </form>
    </Page>)
  }
}