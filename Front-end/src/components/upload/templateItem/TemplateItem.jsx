import React from 'react';
import '../../../styles/components/upload/template.scss';
import { TemplateItemAbstract } from './TemplateItemAbstract';

export const TemplateItem = ({ set, item, active }) => (
  <li className="upload__temp-item">
    <TemplateItemAbstract set={set} item={item} active={active} />
  </li>
);