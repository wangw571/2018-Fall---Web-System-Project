import React, { Component } from 'react';
import { List } from '../components/dashboard';
import { Page } from '../containers';

export class Upload extends Component {
  render() {
    return <Page className='upload'>
      <List/>
    </Page>
  }
}