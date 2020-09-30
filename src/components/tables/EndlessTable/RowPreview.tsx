import React, { CSSProperties } from 'react';
import { ColumnData, RowData } from 'components/tables/EndlessTable';
import DraggableRow from 'components/tables/EndlessTable/DraggableRow';
import { RowConfigInterface } from 'components/tables/EndlessTable/typedefs';

interface TableRowPreviewProps<T extends RowData> {
  columns: ColumnData<T>[];
  headerCells: HTMLCollection;
  itemWrapper: any;
  rowConfig?: RowConfigInterface;
  style?: CSSProperties;
  listDiv: HTMLDivElement;
}

const TableRowPreview = <T extends RowData>({
  columns,
  headerCells,
  itemWrapper,
  rowConfig,
  style,
  listDiv
}: TableRowPreviewProps<T>) => {
  const item = itemWrapper.item;

  return rowConfig?.draggableRow ? (
    <div style={{ boxShadow: '0 0 3px 1px #c8c8c8', ...style }}>
      <DraggableRow
        columns={columns}
        customClassName={item.className}
        headerCells={headerCells}
        index={itemWrapper.startIndex}
        rowItem={item}
        listDiv={listDiv}
      />
    </div>
  ) : null;
};

export default TableRowPreview;
