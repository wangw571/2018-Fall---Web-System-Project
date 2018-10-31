import React, { Component } from 'react';

export class Section extends Component {
  render() {
    const { children, className } = this.props;
    return <section className={`page ${className}`}>
      { children }
    </section>
  }
}