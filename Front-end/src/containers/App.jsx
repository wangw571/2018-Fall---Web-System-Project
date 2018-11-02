import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { NotFound } from '../pages';
import { Dashboard, Login } from '.';
import { Authentication } from '../util';
import '../styles/containers/app.scss';

const auth = Authentication.getInstance();
class _App extends Component {

  componentDidMount() {
    const { history } = this.props;
    const { pathname } = window.location;
    const loggedIn = auth.isAuthenticated();
    console.log(auth.isAuthenticated());
    if (!loggedIn && pathname !== "/") {
      history.push(`/?redirect=${ pathname.replace(process.env.PUBLIC_URL, "") }`);
    } else if (loggedIn && pathname === "/") {
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
