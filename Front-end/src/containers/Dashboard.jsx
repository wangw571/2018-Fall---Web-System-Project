import React, { Component, Fragment } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Nav } from '../components/dashboard';
import { DASHBOARD_NAV } from '../values';
import * as Pages from '../pages';

class _Dashboard extends Component {

  render() {
    const active = window.location.pathname.replace(process.env.PUBLIC_URL, "");
    return <Fragment>
      <Nav active={active}/>
      <Switch>
        {
          DASHBOARD_NAV.map(({ path, Component }, key) => {
            return <Route exact path={`${path}`} key={key} component={Pages[Component]}/>
          })
        }
      </Switch>
    </Fragment>
  }
}

export const Dashboard = withRouter(_Dashboard);