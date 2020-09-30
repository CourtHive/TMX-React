import React, { CSSProperties } from 'react';

import { ColumnData, RowData } from 'components/tables/EndlessTable';
import { CellConfigInterface, DragObjectItemInterface } from 'components/tables/EndlessTable/typedefs';
import DraggableCell from 'components/tables/EndlessTable/DraggableCell';

interface CellPreviewProps<T extends RowData> {
  cellConfig?: CellConfigInterface;
  columns: ColumnData<T>[];
  headerCells: HTMLCollection;
  item: DragObjectItemInterface<T>;
  style?: CSSProperties;
}

const CellPreview = <T extends RowData>({
  cellConfig,
  columns,
  headerCells,
  item,
  style
}: CellPreviewProps<T>) => {
  const getValue = () => ({
    node: columns[item.startIndex]?.getValue(item.item).node
  });
  const cellComputedStyles =
    headerCells && headerCells?.item(item.startIndex)
      ? getComputedStyle(headerCells?.item(item.startIndex))
      : undefined;
  return cellConfig?.draggableCell ? (
    <div
      style={{
        backgroundColor: style?.backgroundColor,
        boxShadow: '0 0 3px 1px #c8c8c8',
        width: cellComputedStyles?.width
      }}
    >
      <DraggableCell
        cellConfig={cellConfig}
        headerCell={headerCells?.item(item.startIndex)}
        getValue={getValue}
        cellIndex={item.startIndex}
        rowItem={item.item}
      />
    </div>
  ) : null;
};

export default CellPreview;
