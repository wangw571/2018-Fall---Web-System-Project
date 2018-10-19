import React, { Component } from 'react';
import { Dashboard, Login } from '.';
import { Authentication } from '../util';
import '../styles/containers/app.scss';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: Authentication.isAuthenticated()
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    return isAuthenticated?
    <Dashboard/>:
    <Login/>
  }
};
