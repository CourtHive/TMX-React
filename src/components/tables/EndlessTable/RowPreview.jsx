import React from 'react';
import DraggableRow from 'components/tables/EndlessTable/DraggableRow';

const RowPreview = ({ columns, headerCells, itemWrapper, rowConfig, style, listDiv }) => {
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

export default RowPreview;
