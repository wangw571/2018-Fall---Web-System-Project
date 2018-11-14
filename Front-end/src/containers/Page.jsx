import React, { Component } from 'react';
import '../styles/containers/page.scss';

export class Page extends Component {
  render() {
    const { children, className } = this.props;
    return <main className={`page ${className}`}>
      { children }
    </main>
  }
}