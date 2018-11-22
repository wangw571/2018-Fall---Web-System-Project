import React from 'react';

export const TableCell = ({ children, update, row, col }) => (
  <div
    className="table__col"
    data-row={row}
    data-col={col}
    onBlur={update}
    dangerouslySetInnerHTML={{__html: children}}
    contentEditable
    suppressContentEditableWarning
  />
);