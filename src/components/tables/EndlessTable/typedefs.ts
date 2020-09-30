import { DragObjectWithType } from 'react-dnd';

export enum DropTypeEnum {
  ADD_TO_CELL = 'ADD_TO_CELL',
  REORDER_CELLS = 'REORDER_CELLS',
  REORDER_ROWS = 'REORDER_ROWS'
}

export interface DragObjectItemInterface<T> extends DragObjectWithType {
  item: T;
  startIndex: number;
}
export interface ClassNameInterface {
  className?: string;
}
export interface CellConfigInterface extends ClassNameInterface {
  draggableCell?: (rowItem: unknown, startIndex: number) => boolean;
  droppableCell?: (rowItem: unknown, startIndex: number) => boolean;
}
export interface RowConfigInterface extends ClassNameInterface {
  draggableRow?: (rowItem: unknown, startIndex: number) => boolean;
  rowSize?: (index: number) => number;
}
export interface TableConfigInterface extends ClassNameInterface {
  tableHeight?: number;
}
