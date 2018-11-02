import React, { Component } from 'react';
import '../../styles/components/dashboard/section.scss';

export class Section extends Component {
  render() {
    const { children, className } = this.props;
    return <section className={`section ${className}`}>
      { children }
    </section>
  }
}