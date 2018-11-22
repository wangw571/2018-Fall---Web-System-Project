import React, { PureComponent } from 'react';
import '../../styles/components/dashboard/section.scss';

export class Section extends PureComponent {
  render() {
    const { children, className } = this.props;
    return <section className={`section ${className}`}>
      <div className='section__wrapper'>
      { children }
      </div>
    </section>
  }
}