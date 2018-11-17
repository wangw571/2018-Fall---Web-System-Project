import React, { Component } from 'react';
import { List, Section } from '../components/dashboard';
import { Page } from '../containers';
import '../styles/pages/queries.scss';

export class Queries extends Component {
  render() {
    return <Page className="query">
      <div className="query__list">
        <List block="query" onClick={null} active={null} items={[]} map={null}>
          <h3 className="query__list-header">Queries</h3>
        </List>
        <button type="button" className="query__list-button">Add Query</button>
      </div>
      <Section className="query__page">
        <h1>Something</h1>
      </Section>
    </Page>
  }
}