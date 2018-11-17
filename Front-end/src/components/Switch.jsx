import React from 'react';
import '../styles/components/switch.scss';

export const Switch = ({ className, name, value, onChange }) => (
  <div className={`switch ${className? `switch--${className}`: ""}`}>
    <input type="checkbox" name={name} className="switch__input" onChange={onChange} checked={value}/>
    <div className="switch__switch"/>
  </div>
)