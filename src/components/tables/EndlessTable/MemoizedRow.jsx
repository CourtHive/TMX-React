import React, { memo } from 'react';
import { areEqual } from 'react-window';
import DraggableRow from 'components/tables/EndlessTable/DraggableRow';
import { DEFAULT_ROW_SIZE } from 'components/tables/EndlessTable/constants';

const MemoizedRow = memo(({ index, style, data }) => {
  const rowItem = data.data[index];
  const customClassName = rowItem.className;
  const {
    cellConfig,
    columns,
    headerCells,
    onCellClick,
    onDrop,
    onRowClick,
    onRowMouseOver,
    onRowMouseOut,
    rowConfig,
    VLRef
  } = data.props;
  const offset = data?.data?.reduce((accumulator, currentValue, currentIndex) => {
    const value =
      currentIndex < index ? (rowConfig?.rowSize && rowConfig.rowSize(currentIndex)) || DEFAULT_ROW_SIZE : 0;
    return value ? accumulator + value : accumulator;
  }, 0);
  return (
    <DraggableRow
      cellConfig={cellConfig}
      columns={columns}
      customClassName={customClassName}
      headerCells={headerCells}
      index={index}
      offsetTop={offset}
      onCellClick={onCellClick}
      onDrop={onDrop}
      onRowMouseOver={onRowMouseOver}
      onRowMouseOut={onRowMouseOut}
      onRowClick={onRowClick}
      rowItem={rowItem}
      rowConfig={rowConfig}
      style={style}
      listDiv={VLRef}
    />
  );
}, areEqual);

export default MemoizedRow;
