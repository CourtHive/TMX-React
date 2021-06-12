import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import TableRow from '@material-ui/core/TableRow';

import DraggableCell from 'components/tables/EndlessTable/DraggableCell';
import { DropTypeEnum } from 'components/tables/EndlessTable/typedefs';
import { useStyles } from 'components/tables/EndlessTable/styles';
import { useCombinedRefs } from 'hooks/useCombinedRefs';
import { DEFAULT_ROW_SIZE } from 'components/tables/EndlessTable/constants';

const DraggableRow = ({
  cellConfig,
  columns,
  customClassName,
  headerCells,
  index,
  offsetTop,
  onCellClick,
  onDrop,
  onRowMouseOver,
  onRowMouseOut,
  onRowClick,
  rowConfig,
  rowItem,
  style,
  listDiv
}) => {
  const classes = useStyles();
  const firstChild = listDiv?.firstChild;
  const scrollExists = listDiv?.getBoundingClientRect()?.width > firstChild?.getBoundingClientRect()?.width;
  const customDragHandleProvided = columns.find((column) => column.getValue(rowItem).isDragHandle);
  const isDraggableRowFromConfig = rowConfig?.draggableRow && rowConfig.draggableRow(rowItem, index);

  const [, dragRow, preview] = useDrag({
    item: { item: rowItem, startIndex: index, type: 'draggableRow' },
    canDrag: isDraggableRowFromConfig
  });
  const [, dropRow] = useDrop({
    accept: 'draggableRow',
    drop: (dragItem) => onDrop && onDrop(dragItem, index, DropTypeEnum.REORDER_ROWS)
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const combinedRefs = useCombinedRefs(dragRow, dropRow);
  const ref =
    rowConfig?.draggableRow && rowConfig?.draggableRow(rowItem, index) && !customDragHandleProvided
      ? combinedRefs
      : dropRow;
  const rowHeightDefined = rowConfig?.rowSize(index);
  const rowHeight = rowHeightDefined || DEFAULT_ROW_SIZE;

  const handleRowClick = (event) => {
    onRowClick && onRowClick(event, rowItem, index);
  };
  const handleOnMouseOver = (event) => {
    onRowMouseOver && onRowMouseOver(event, rowItem, index);
  };
  const handleOnMouseOut = (event) => {
    onRowMouseOut && onRowMouseOut(event, rowItem, index);
  };

  return (
    <TableRow
      className={`${classes.tableRow}${customClassName ? ` ${customClassName}` : ''}${
        rowConfig?.className ? ` ${rowConfig.className}` : ''
      }`}
      component="div"
      key={rowItem.id}
      onClick={handleRowClick}
      onMouseOver={handleOnMouseOver}
      onMouseLeave={handleOnMouseOut}
      ref={ref}
      style={{ ...style, display: 'table', width: '100%', height: rowHeight, top: offsetTop }}
    >
      {columns.map(({ key, getValue }, cellIndex) => (
        <DraggableCell
          cellConfig={cellConfig}
          dragRowRef={dragRow}
          headerCell={headerCells?.namedItem(key)}
          getValue={getValue}
          cellIndex={cellIndex}
          isLast={columns.length - 1 === cellIndex}
          key={key}
          cellKey={key}
          onCellClick={onCellClick}
          onDrop={onDrop}
          rowItem={rowItem}
          rowConfig={rowConfig}
          scrollExists={scrollExists}
        />
      ))}
    </TableRow>
  );
};

export default DraggableRow;
