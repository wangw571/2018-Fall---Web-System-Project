import React, { Component } from 'react';
import { Page } from '../containers';

export class Profile extends Component {
  render() {
    return <Page className='profile'>
      Profile
      <form className="profile__form">
        <div className="profile__organization-info">
          Organization's name
        </div>
      </form>
      







    </Page>
  }
}