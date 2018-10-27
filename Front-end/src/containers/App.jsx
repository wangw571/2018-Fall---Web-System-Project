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
  }

  componentDidMount() {
    const { history } = this.props;
    const { isAuthenticated } = this.state;
    const { pathname } = window.location;
    if (!isAuthenticated && pathname !== "/") {
      history.push(`/?redirect=${ pathname.replace(process.env.PUBLIC_URL, "") }`);
    } else if (isAuthenticated && pathname === "/") {
      history.push('/app/upload');
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
