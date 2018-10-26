import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { NotFound } from '../pages';
import { Dashboard, Login } from '.';
import { Authentication } from '../util';
import '../styles/containers/app.scss';

class _App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: Authentication.isAuthenticated()
    }
    console.log(Authentication.login("test", "test"));
  }

  componentDidMount() {
    const path = window.location.pathname;
    console.log(path);
    if (!this.state.isAuthenticated && path !== "/") {
      this.props.history.push(`/?redirect=${ path.replace(process.env.PUBLIC_URL, "") }`);
    }
  }

  render() {
    return <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/app" component={Dashboard}/>
      <Route path="/" component={NotFound}/>
    </Switch>
  }
};

export const App = withRouter(_App);
