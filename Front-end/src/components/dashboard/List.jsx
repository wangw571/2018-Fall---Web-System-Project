import React, { Component } from 'react';

export class List extends Component {
  render() {
    const { block, children, items, active, map, onClick } = this.props;
    return <ul className={`list list--${block}`}>
      <li className="list__item list__item--header">
        { children }
      </li>
      {
        items.map((item, key) => {
          const className = `list__item${key === active ? " list__item--active" : ""}`;
          return <li onClick={onClick} key={key} className={className}>
            { map(item, key) }
          </li>
        })
      }
    </ul>
  }
}