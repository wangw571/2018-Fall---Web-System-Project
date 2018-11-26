import React from 'react';
import { validate } from '../../util';

export const TableCell = ({ children, update, row, col, disabled, check }) => (
  <div
    className={`table__col${validate(children, check)? "": " table__col--error"}`}
    data-row={row}
    data-col={col}
    onBlur={update}
    dangerouslySetInnerHTML={{__html: children}}
    contentEditable={!disabled}
    suppressContentEditableWarning
  />
);