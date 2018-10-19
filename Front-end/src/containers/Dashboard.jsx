import React, { Component, Fragment } from 'react';
import { DASHBOARD_NAV } from '../values';
import '../styles/containers/dashboard.scss';

export class Dashboard extends Component {
  render() {
    const { children } = this.props;
    return <Fragment>
      <nav className="dashboard__nav">
        <ul className="dahsboard__items">
        {
          DASHBOARD_NAV.map(({ text, path }) =>
            <li className="dashboard__item">
              <a className="dashboard__item-link" href={path}>{ text }</a>
            </li>
          )
        }
        </ul>
      </nav>
      <main className="dashboard__content">
        { children }
      </main>
    </Fragment>
  }
}