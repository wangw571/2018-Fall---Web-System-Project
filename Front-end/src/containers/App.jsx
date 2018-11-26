import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { NotFound, Login } from '../pages';
import { Dashboard } from '.';
import { Authentication } from '../util';
import '../styles/containers/app.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const auth = Authentication.getInstance();
class _App extends Component {

  state = { loaded: false }

  async componentDidMount() {
    const { history } = this.props;
    const { pathname } = window.location;
    const loggedIn = auth.isAuthenticated();
    if (!loggedIn && pathname !== "/") {
      history.push(`/?redirect=${ pathname.replace(process.env.PUBLIC_URL, "") }`);
    } else if (loggedIn && pathname === "/") {
      history.push('/app/upload');
    }
  }

  render() {
    return <Fragment>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/app" component={Dashboard}/>
        <Route path="/" component={NotFound}/>
      </Switch>
      <ToastContainer closeButton={false} position="bottom-right" autoClose={4000} closeOnClick hideProgressBar/>
    </Fragment>
  }
};

export const App = withRouter(_App);
