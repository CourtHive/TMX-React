import React, { CSSProperties } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';

import TableRowPreview from 'components/tables/EndlessTable/RowPreview';
import CustomPreviewWrapper from 'components/tables/EndlessTable/CustomPreviewWrapper';
import { ColumnData, RowData } from 'components/tables/EndlessTable';
import CellPreview from 'components/tables/EndlessTable/CellPreview';
import {
  CellConfigInterface,
  DragObjectItemInterface,
  RowConfigInterface
} from 'components/tables/EndlessTable/typedefs';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};
const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
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

interface CustomDragPreviewFactoryProps<T extends RowData> {
  cellConfig?: CellConfigInterface;
  customTableRowPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;
  customRowCellPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;
  columns: ColumnData<T>[];
  headerCells: HTMLCollection;
  previewStyle?: CSSProperties;
  rowConfig?: RowConfigInterface;
  listDiv: HTMLDivElement;
}

const CustomDragPreviewFactory = <T extends RowData>({
  cellConfig,
  customTableRowPreview,
  customRowCellPreview,
  columns,
  headerCells,
  previewStyle,
  rowConfig,
  listDiv
}: CustomDragPreviewFactoryProps<T>) => {
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
          <TableRowPreview
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
