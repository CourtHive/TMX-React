import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import HeaderCell from 'components/tables/EndlessTable/HeaderCell';
import {
  CellConfigInterface,
  DragObjectItemInterface,
  DropTypeEnum,
  RowConfigInterface,
  TableConfigInterface
} from 'components/tables/EndlessTable/typedefs';
import CustomDragPreviewFactory from 'components/tables/EndlessTable/CustomDragPreviewFactory';
import MemoizedRow from 'components/tables/EndlessTable/MemoizedRow';
import { DEFAULT_ROW_SIZE } from './constants';

export interface RowData {
  id: string;
  className?: string;
}
export interface ColumnData<T extends RowData> {
  key: string;
  getTitle?: (t?: T) => { node: React.ReactNode; className?: string };
  getValue: (t: T, cellIndex?: number) => { node: React.ReactNode; className?: string; isDragHandle?: boolean };
  hidden?: (t?: T) => boolean;
}

interface EndlessTableProps<T extends RowData> {
  id?: string;
  cellConfig?: CellConfigInterface;
  columns: ColumnData<T>[];
  customTableRowPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;
  customRowCellPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;
  data?: T[];
  initialScrollOffset?: number;
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
  tableConfig?: TableConfigInterface;
}

const EndlessTable = <T extends RowData>({
  id,
  cellConfig,
  columns,
  customRowCellPreview,
  customTableRowPreview,
  data,
  initialScrollOffset,
  onCellClick,
  onDrop,
  onRowClick,
  onRowMouseOver,
  onRowMouseOut,
  rowConfig,
  tableConfig
}: EndlessTableProps<T>) => {
  const headerRowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [VLRef, setVLRef] = useState(null);
  const [headerCells, setHeaderCells] = useState<HTMLCollection>(null);
  const [paperDiv, setPaperDiv] = useState(null);
  const [divDistanceFromLeft, setDivDistanceFromLeft] = useState(null);
  const [domColumnsCount, triggerUpdate] = useState(null);
  const [domRowsCount, triggerUpdateRows] = useState(null);
  const paperComputedStyle = paperDiv ? getComputedStyle(paperDiv) : undefined;
  const previewBackgroundColor = paperComputedStyle?.backgroundColor || '#ffffff';
  const previewWidth = paperComputedStyle?.width || '100%';
  const dataLength = data?.length;
  const columnsLength = columns?.length;

  // marginLeft fixes custom preview drag handle issue
  const previewStyle = {
    backgroundColor: previewBackgroundColor,
    marginLeft: -divDistanceFromLeft || 0,
    width: previewWidth
  };

  useEffect(() => {
    setVLRef(listRef?.current);
    setHeaderCells(headerRowRef?.current?.children);
    setDivDistanceFromLeft(headerRowRef?.current?.getBoundingClientRect()?.x);
    setPaperDiv(paperRef?.current);

    // provides support for initialScrollOffset until the issue within the react-window is resolved
    if (initialScrollOffset && listRef?.current) {
      listRef.current.scrollTo({ top: initialScrollOffset });
    }
    /**
     * This is important because in cases where the user dynamically adds / removes columns, the component needs
     * to be re-rendered again, so the refs can be consistent. Without this, DOM refs are always "late by one" render.
     */
    if (domColumnsCount !== columnsLength) {
      triggerUpdate(columnsLength);
    }
    if (domRowsCount !== dataLength) {
      triggerUpdateRows(dataLength);
    }
  }, [domColumnsCount, domRowsCount, columnsLength, dataLength, initialScrollOffset]);

  const getRowHeight = (index: number) => {
    if (rowConfig?.rowSize) {
      const isDefined = rowConfig.rowSize(index);
      if (isDefined) {
        return isDefined;
      }
    }
    return DEFAULT_ROW_SIZE;
  };
  const allRowsHeight = data.reduce((total, _, index) => total + getRowHeight(index), 0);

  const rowData = {
    data: data,
    props: {
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
    }
  };

  return (
    <>
      <TableContainer ref={paperRef} component={Paper} className={tableConfig?.className ? tableConfig.className : ''}>
        <Table
          component="div"
          id={id}
          style={{
            backgroundColor: previewBackgroundColor
          }}
        >
          <TableHead component="div" style={{ display: 'table', width: `100%` }}>
            <TableRow ref={headerRowRef} component="div">
              {columns.map((column) => (
                <HeaderCell key={column.key} cellConfig={cellConfig} column={column} />
              ))}
            </TableRow>
          </TableHead>
          {domColumnsCount && domColumnsCount > 0 && domColumnsCount !== columnsLength ? (
            <div style={{ height: tableConfig?.tableHeight || 300, width: '100%' }} />
          ) : (
            <>
              <TableBody component="div" style={{ display: 'table', width: `100%` }}>
                <List
                  height={tableConfig?.tableHeight || allRowsHeight}
                  itemCount={data?.length || 0}
                  itemData={rowData}
                  itemSize={getRowHeight}
                  overscanCount={4}
                  outerRef={listRef}
                  width="100%"
                >
                  {MemoizedRow}
                </List>
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
      <CustomDragPreviewFactory
        cellConfig={cellConfig}
        columns={columns}
        customTableRowPreview={customTableRowPreview}
        customRowCellPreview={customRowCellPreview}
        headerCells={headerCells}
        previewStyle={previewStyle}
        rowConfig={rowConfig}
        listDiv={VLRef}
      />
    </>
  );
};

export default EndlessTable;
