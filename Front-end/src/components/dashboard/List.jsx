import React, { PureComponent } from 'react';
import '../../styles/components/dashboard/list.scss';
import { ShowListContext } from '../../containers';

export class List extends PureComponent {
  render() {
    const { block, children, items, active, map, onClick } = this.props;
    return <ShowListContext.Consumer>{
      context => (
      <ul className={`list list--${block}${context? " list--show": ""}`}>
        <li className="list__item list__item--header">
          { children }
        </li>
        {
          items?
          items.map((item, key) => {
            const className = `list__item${key === active ? " list__item--active" : ""}`;
            return <li tabIndex={0} onClick={key !== active? onClick.bind(this, key): null} key={key} className={className}>
              { map(item, key) }
            </li>
          }):
          <li className="list__item list__item--loader list__item--active">
            <i className="list__loader green__loader fas fa-circle-notch"/>Loading...
          </li>
        }
      </ul>
      )
    }</ShowListContext.Consumer>
  }
}