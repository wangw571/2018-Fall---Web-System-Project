import React, { Component, Fragment } from 'react';
import { List } from '../components/dashboard';
import { Page } from '../containers';

import '../styles/pages/upload.scss';

const test = [
  {
    status: 0,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  },
  {
    status: 1,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  },
  {
    status: 2,
    title: "What is Lorem Ipsum?",
    due: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit urna quis purus congue congue. Vestibulum facilisis non ante eget mollis."
  }
]

const MAX_SIZE = 120;
export class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      active: 0
    }
  }

  getStatus = status => {
    switch (status) {
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

  componentDidMount() {
    this.setState({ items: test })
  }

  itemMap = ({ status, title, description, due }) => {
    const statusText = this.getStatus(status);

    return <Fragment>
      <p className={`upload__item-status upload__item-status--${statusText.toLowerCase()}`}>{statusText}</p>
      <div className="upload__item-header">
        <h4 className="upload__item-title">{title}</h4>
        <span className="upload__item-label">
          <i className="upload__item-icon far fa-clock" />
          {this.getDiff(due)}
        </span>
      </div>
      <p className="upload__item-text">
        {description.length > MAX_SIZE ? description.slice(0, MAX_SIZE) + "..." : description}
      </p>
    </Fragment>
  }

  render() {
    const { items, active } = this.state;
    return <Page className='upload'>
      <div className="upload__container">
        <List block="upload" active={active} items={items} map={this.itemMap}>
          <h3 className="upload__upload-header">Templates</h3>
        </List>
      </div>
    </Page>
  }
}