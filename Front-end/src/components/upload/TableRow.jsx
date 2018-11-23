import React from 'react';
import { TableCell } from './TableCell';

export const TableRow = ({ row, update, index, disabled }) => (
  <div data-row={index} className="table__row">
    {
      row.map((col, key) =>
        <TableCell key={key} disabled={disabled} row={index} col={key} update={update}>
          { col? col: "" }
        </TableCell>
      )
    }
  </div>
);