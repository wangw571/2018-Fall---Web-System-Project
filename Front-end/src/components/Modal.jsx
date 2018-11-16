import React, { PureComponent } from 'react';
import '../styles/components/modal.scss';

export class Modal extends PureComponent {

  close = () => this.props.close();

  render() {
    const { className, children, show } = this.props;
    const name = `modal${show ? "": " modal--fade"}${className ? " " + className : ""}`;
    return <div className={name}>
      <div onClick={this.close} className="modal__back"/>
      <div className="modal__box">
        { children }
      </div>
    </div>
  }
} 