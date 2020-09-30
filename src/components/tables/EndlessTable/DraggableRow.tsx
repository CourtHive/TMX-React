import React, { CSSProperties, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import TableRow from '@material-ui/core/TableRow';

import { ColumnData, RowData } from 'components/tables/EndlessTable';
import DraggableCell from 'components/tables/EndlessTable/DraggableCell';
import {
  CellConfigInterface,
  DragObjectItemInterface,
  DropTypeEnum,
  RowConfigInterface
} from 'components/tables/EndlessTable/typedefs';
import { useStyles } from 'components/tables/EndlessTable/styles';
import { useCombinedRefs } from 'components/hooks/useCombinedRefs';

export interface DraggableRowProps<T extends RowData> {
  cellConfig?: CellConfigInterface;
  columns: ColumnData<T>[];
  customClassName?: string;
  headerCells: HTMLCollection;
  index: number;
  onCellClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, cellIIndex?: number) => void;
  onDrop?: (
    dragObject: DragObjectItemInterface<T>,
    endIndex: number,
    dropType: DropTypeEnum,
    dropRowId?: string
  ) => unknown;
  onRowClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;
  onRowMouseOver?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;
  onRowMouseOut?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;
  rowConfig?: RowConfigInterface;
  rowItem: T;
  style?: CSSProperties;
  listDiv: HTMLDivElement;
}

const DraggableRow = <T extends RowData>({
  cellConfig,
  columns,
  customClassName,
  headerCells,
  index,
  onCellClick,
  onDrop,
  onRowMouseOver,
  onRowMouseOut,
  onRowClick,
  rowConfig,
  rowItem,
  style,
  listDiv
}: DraggableRowProps<T>) => {
  const classes = useStyles();
  const firstChild = listDiv?.firstChild as Element;
  const scrollExists = listDiv?.getBoundingClientRect()?.width > firstChild?.getBoundingClientRect()?.width;
  const customDragHandleProvided = columns.find((column) => column.getValue(rowItem).isDragHandle);
  const isDraggableRowFromConfig = rowConfig?.draggableRow && rowConfig.draggableRow(rowItem, index);

  const [, dragRow, preview] = useDrag({
    item: { item: rowItem, startIndex: index, type: 'draggableRow' } as DragObjectItemInterface<T>,
    canDrag: isDraggableRowFromConfig
  });
  const [, dropRow] = useDrop({
    accept: 'draggableRow',
    drop: (dragItem) => onDrop && onDrop(dragItem as DragObjectItemInterface<T>, index, DropTypeEnum.REORDER_ROWS)
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const combinedRefs = useCombinedRefs(dragRow, dropRow);
  const ref = (rowConfig?.draggableRow && rowConfig?.draggableRow(rowItem, index) && !customDragHandleProvided
    ? combinedRefs
    : dropRow) as React.RefObject<HTMLDivElement>;

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
      style={{ display: 'table', width: '100%', ...style }}
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
