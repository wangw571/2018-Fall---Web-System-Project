import React from 'react';
import { TableCell } from './TableCell';

export const TableRow = ({ row, update, index, disabled, temp }) => (
  <div data-row={index} className="table__row">
    {
      row.map((col, key) =>
        <TableCell key={key} check={temp[key]} disabled={disabled} row={index} col={key} update={update}>
          { col? col: "" }
        </TableCell>
      )
    }
  </div>
);