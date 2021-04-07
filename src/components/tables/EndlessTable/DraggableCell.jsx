import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { TableCell } from '@material-ui/core';

import { DropTypeEnum } from 'components/tables/EndlessTable/typedefs';
import { useCombinedRefs } from 'components/hooks/useCombinedRefs';
import { useStyles } from 'components/tables/EndlessTable/styles';

const DraggableCell = ({
  cellConfig,
  dragRowRef,
  getValue,
  headerCell,
  cellIndex,
  isLast,
  cellKey,
  onCellClick,
  onDrop,
  rowConfig,
  rowItem,
  scrollExists
}) => {
  const classes = useStyles();
  const isDraggable = cellConfig?.draggableCell ? cellConfig.draggableCell(rowItem, cellIndex) : false;
  const isDroppable = cellConfig?.droppableCell ? cellConfig.droppableCell(rowItem, cellIndex) : false;
  const cellItem = getValue(rowItem);
  const cellCustomClass = cellItem?.className;
  const dragHandle = cellItem?.isDragHandle;
  const node = cellItem?.node || null;
  const widthNumber = isLast && scrollExists ? headerCell?.clientWidth - 20 : headerCell?.clientWidth;
  const width = widthNumber ? `${widthNumber}px` : 'auto';
  const style = {
    width: width,
    maxWidth: width,
    minWidth: width,
    overflow: 'hidden'
  };
  const isCellDroppable = () => !rowConfig?.draggableRow && isDroppable;

  const [, dragCell, preview] = useDrag({
    item: { item: rowItem, startIndex: cellIndex, type: 'draggableCell' },
    canDrag: isDraggable
  });
  const [, dropCell] = useDrop({
    accept: ['draggableRow', 'draggableCell'],
    canDrop: isCellDroppable,
    drop: (dragItem) =>
      onDrop(
        dragItem,
        cellIndex,
        dragItem.type === 'draggableRow' ? DropTypeEnum.ADD_TO_CELL : DropTypeEnum.REORDER_CELLS,
        rowItem.id
      ),
    collect: (monitor) => {
      return {
        hovered: monitor.isOver()
      };
    }
  });

  const combinedRefs = useCombinedRefs(dragCell, dropCell, dragHandle ? dragRowRef : undefined);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const handleCellClick = (event) => {
    if (onCellClick) onCellClick(event, rowItem, cellIndex);
  };

  return (
    <TableCell
      className={`${classes.tableCell}${cellCustomClass ? ` ${cellCustomClass}` : ''}${
        cellConfig?.className ? ` ${cellConfig.className}` : ''
      }`}
      component="div"
      key={cellKey}
      onClick={handleCellClick}
      ref={combinedRefs}
      style={style}
    >
      {node}
    </TableCell>
  );
};

export default DraggableCell;
