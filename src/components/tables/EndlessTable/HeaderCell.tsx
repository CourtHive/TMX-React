import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { ColumnData, RowData } from 'components/tables/EndlessTable';
import { CellConfigInterface } from 'components/tables/EndlessTable/typedefs';

interface HeaderCellProps<T extends RowData> {
  cellConfig: CellConfigInterface;
  column: ColumnData<T>;
}

const HeaderCell = <T extends RowData>({ cellConfig, column }: HeaderCellProps<T>) => {
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
