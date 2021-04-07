import React from 'react';
import TableCell from '@material-ui/core/TableCell';

const HeaderCell = ({ cellConfig, column }) => {
  const className = column.getTitle()?.className;
  return (
    <TableCell
      className={`${cellConfig?.className ? cellConfig.className : ''}${className ? ` ${className}` : ''}`}
      component="div"
      id={column.key}
      key={column.key}
    >
      <div>{column.getTitle()?.node || ''}</div>
    </TableCell>
  );
};

export default HeaderCell;
