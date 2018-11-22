import React from 'react';
import { TableCell } from './TableCell';

export const TableRow = ({ row, update, index }) => (
  <div data-row={index} className="table__row">
    {
      row?
      row.map((col, key) =>
        <TableCell key={key} row={index} col={key} update={update}>
          { col? col: "" }
        </TableCell>
      )
      :
      <div className="green__loader-wrap">
        <i className="green__loader fas fa-circle-notch"/>Loading...
      </div>
    }
  </div>
);