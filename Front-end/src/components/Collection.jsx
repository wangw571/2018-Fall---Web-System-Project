import React, { Component } from 'react';
import '../styles/components/collection.scss';

export class Collection extends Component {
  render() {
    const { items, active = [], layout, block, click } = this.props;
    return <ul className={`collect${block? ` collect--${block}`: ""}`}>
      {
        items?
        items.map((item, key) => {
          const className = `collect__item${active.indexOf(key) > -1? " collect__item--active": ""}`;
          return <li key={key} onClick={click} data-key={key} className={className}>
            { layout(item, key) }
          </li>
        }):
        <li className="collect__item collect__item--loader collect__item--active">
          <i className="collect__loader green__loader fas fa-circle-notch"/>Loading...
        </li>
      }
    </ul>
  }
}