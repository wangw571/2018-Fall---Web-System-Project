import React, { Component } from 'react';
import '../../styles/components/dashboard/list.scss';

const items = [
  {
    date: new Date(),
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  }
]

export class List extends Component {

  parseLongDate = date => {
    return "October 28, 2018"
  }

  parseShortDate = date => {
    return "10/10/18"
  }

  render() {
    // const { items } = this.props;
    return <ul className="list">
      {
        items.map(({ date, title, description, due }, key) => {
          return <li key={key} className="list__item">
            <p className="list__item-date">{ this.parseLongDate(date) }</p>
            <div className="list__item-header">
              <h3 className="list__item-title">{ title }</h3>
              <span className="list__item-label">{ this.parseShortDate(due) }</span>
            </div>
            <p className="list__item-text">{ description }</p>
          </li>
        })
      }
    </ul>
  }
}