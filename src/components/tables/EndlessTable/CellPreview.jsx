import React from 'react';

import DraggableCell from 'components/tables/EndlessTable/DraggableCell';

const CellPreview = ({ cellConfig, columns, headerCells, item, style }) => {
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
