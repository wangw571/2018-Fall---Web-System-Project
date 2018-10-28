import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DASHBOARD_NAV } from '../../values';
import { Authentication } from '../../util';
import '../../styles/components/dashboard/nav.scss';

const auth = Authentication.getInstance();
export class Nav extends Component {
  render() {
    const { active } = this.props;
    return <nav className="nav">
      <ul className="nav__body">
        <li className="nav__item nav__item--logo">
          <i className="nav__icon nav__icon--logo fas fa-seedling" />GreenCare
        </li>
        {
          DASHBOARD_NAV.map(({path, text, icon}, key) =>
            <li key={key} className={`nav__item${active === path? " nav__item--active": ""}`}>
              <Link to={path} className="nav__link">
                <i className={`nav__icon fas fa-${icon}`} />{ text }
              </Link>
            </li>
          )
        }
        <li className="nav__item nav__item--logout">
          <Link to="/" className="nav__link" onClick={auth.logout}>
            <i className="nav__icon fas fa-power-off" />Logout
          </Link>
        </li>
      </ul>
    </nav>
  }
}