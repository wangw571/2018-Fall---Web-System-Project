import React, { Component, Fragment } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Nav } from '../components/dashboard';
import { DASHBOARD_NAV } from '../values';
import * as Pages from '../pages';

export const ShowListContext = React.createContext(false);
class _Dashboard extends Component {

  state = { showList: false }
  toggleList = () => this.setState(({ showList }) => ({ showList: !showList }))

  render() {
    const { showList } = this.state;
    const active = window.location.pathname.replace(process.env.PUBLIC_URL, "");
    return <ShowListContext.Provider value={showList}>
      <Nav active={active} toggleList={this.toggleList} />
      <Switch>
        {
          DASHBOARD_NAV.map(({ path, Component }, key) => {
            return <Route exact path={`${path}`} key={key} component={Pages[Component]}/>
          })
        }
      </Switch>
    </ShowListContext.Provider>
  }
}

export const Dashboard = withRouter(_Dashboard);