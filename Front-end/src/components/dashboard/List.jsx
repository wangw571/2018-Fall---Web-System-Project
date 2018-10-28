import React, { Component } from 'react';
import '../../styles/components/dashboard/list.scss';

const MAX_SIZE = 120;

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: 0
    }
  }

  getStatus = status => {
    switch(status) {
      case 0:
        return "Missing";
      case 1:
        return "Uploaded";
      case 2:
        return "Submitted";
      default:
        return "Error";
    }
  }

  getDiff = date => {
    return "10 Days"
  }

  setActive = active => (
    this.setState({ active })
  )

  render() {
    const { items, children } = this.props;
    const { active } = this.state;
    console.log(active)
    return <ul className="list">
      { children?
        <li className="list__item list__item--head">
          { children }
        </li>: null
      }
      {
        items.map(({ status, title, description, due }, key) => {
          const click = this.setActive.bind(this, key);
          const statusText = this.getStatus(status);
          const className = `list__item${key === active ? " list__item--active" : ""}`;

          return <li key={key} onClick={click} className={className}>
            <p className={`list__item-status list__item-status--${ statusText.toLowerCase() }`}>{ statusText }</p>
            <div className="list__item-header">
              <h4 className="list__item-title">{ title }</h4>
              <span className="list__item-label">
                <i className="list__item-icon far fa-clock"/>
                { this.getDiff(due) }
              </span>
            </div>
            <p className="list__item-text">
              { description.length > MAX_SIZE? description.slice(0, MAX_SIZE) + "...": description }
            </p>
          </li>
        })
      }
    </ul>
  }
}