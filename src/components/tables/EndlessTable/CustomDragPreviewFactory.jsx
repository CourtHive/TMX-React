import React from 'react';
import { useDragLayer } from 'react-dnd';

import RowPreview from 'components/tables/EndlessTable/RowPreview';
import CustomPreviewWrapper from 'components/tables/EndlessTable/CustomPreviewWrapper';
import CellPreview from 'components/tables/EndlessTable/CellPreview';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};
const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
};

const CustomDragPreviewFactory = ({
  cellConfig,
  customTableRowPreview,
  customRowCellPreview,
  columns,
  headerCells,
  previewStyle,
  rowConfig,
  listDiv
}) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const renderItem = () => {
    switch (itemType) {
      case 'draggableRow':
        return customTableRowPreview ? (
          <CustomPreviewWrapper>{customTableRowPreview(item)}</CustomPreviewWrapper>
        ) : (
          <RowPreview
            columns={columns}
            headerCells={headerCells}
            itemWrapper={item}
            style={previewStyle}
            rowConfig={rowConfig}
            listDiv={listDiv}
          />
        );
      case 'draggableCell':
        return customRowCellPreview ? (
          <CustomPreviewWrapper>{customRowCellPreview(item)}</CustomPreviewWrapper>
        ) : (
          <CellPreview
            cellConfig={cellConfig}
            columns={columns}
            headerCells={headerCells}
            item={item}
            style={previewStyle}
          />
        );
      default:
        return null;
    }
  };
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>{renderItem()}</div>
    </div>
  );
};

export default CustomDragPreviewFactory;
