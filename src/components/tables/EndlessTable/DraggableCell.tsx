import React, { CSSProperties, Ref, useEffect } from 'react';
import { ConnectableElement, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { TableCell } from '@material-ui/core';

import { RowData } from 'components/tables/EndlessTable';
import {
  CellConfigInterface,
  DragObjectItemInterface,
  DropTypeEnum,
  RowConfigInterface
} from 'components/tables/EndlessTable/typedefs';
import { useCombinedRefs } from 'components/hooks/useCombinedRefs';
import { useStyles } from 'components/tables/EndlessTable/styles';

interface DraggableCellProps<T extends RowData> {
  cellConfig?: CellConfigInterface;
  dragRowRef?: Ref<ConnectableElement>;
  getValue: (t: T) => { node: React.ReactNode; className?: string; isDragHandle?: boolean };
  headerCell: Element;
  cellIndex: number;
  isLast?: boolean;
  cellKey?: string;
  onCellClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, cellIIndex?: number) => void;
  onDrop?: (
    dragObject: DragObjectItemInterface<T>,
    endIndex: number,
    dropType: DropTypeEnum,
    dropRowId?: string
  ) => unknown;
  rowConfig?: RowConfigInterface;
  rowItem: T;
  scrollExists?: boolean;
}

const DraggableCell = <T extends RowData>({
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
}: DraggableCellProps<T>) => {
  const classes = useStyles();
  const isDraggable = cellConfig?.draggableCell ? cellConfig.draggableCell(rowItem, cellIndex) : false;
  const isDroppable = cellConfig?.droppableCell ? cellConfig.droppableCell(rowItem, cellIndex) : false;
  const cellItem = getValue(rowItem);
  const cellCustomClass = cellItem?.className;
  const dragHandle = cellItem?.isDragHandle;
  const node = cellItem?.node;
  const widthNumber = isLast && scrollExists ? headerCell?.clientWidth - 20 : headerCell?.clientWidth;
  const width = widthNumber ? `${widthNumber}px` : 'auto';
  const style = {
    width: width,
    maxWidth: width,
    minWidth: width,
    overflow: 'hidden'
  } as CSSProperties;
  const isCellDroppable = () => !rowConfig?.draggableRow && isDroppable;

  const [, dragCell, preview] = useDrag({
    item: { item: rowItem, startIndex: cellIndex, type: 'draggableCell' } as DragObjectItemInterface<T>,
    canDrag: isDraggable
  });
  const [, dropCell] = useDrop({
    accept: ['draggableRow', 'draggableCell'],
    canDrop: isCellDroppable,
    drop: (dragItem) =>
      onDrop(
        dragItem as DragObjectItemInterface<T>,
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
