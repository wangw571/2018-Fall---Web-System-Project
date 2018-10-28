import React, { Component } from 'react';
import { List } from '../components/dashboard';
import { Page } from '../containers';

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

export class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    this.setState({ items: test })
  }

  render() {
    const { items } = this.state;
    return <Page className='upload'>
      <div className="upload__items">
        <List items={items}>
          <h3 className="upload__list-header">Templates</h3>
        </List>
      </div>
    </Page>
  }
}