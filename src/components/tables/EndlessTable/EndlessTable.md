# Endless Table

## TMX Endless Table is an adaptation of TMX Virtualized Table created by Vuk Nikolic

Endless table is created on top of React material-ui table, and it provides `virtualization` functionality for the
table. It uses `react-window` as a library which provides virtual list, and `react-dnd` for drag n drop functiionality.

The goal of this component is to leave absolute freedom for the user regarding the design, it's possible to fully
customize it "from the outside".

### Dependencies

- `"react-window": "^1.8.5"`
- `"react-dnd": "^11.1.3"`
- `"react-dnd-html5-backend": "^11.1.3"`
- `useCombinedRefs` - a custom hook which comines Refs. TODO: Add `useCombineRefs` to the Endless table utils.

### Usage

The most basic use case is to provide only `data` and `columns` props. Data represents rows, and columns represent
table columns. Endless table is strongly typed, so in order to avoid typescript complains, both `data` and `columns`
need to extend `RowData` and `ColumnData` interface which is provided by the Component:

- data: `interface TestTableDataInterface extends RowData {...}`
- columns: `const columns: ColumnData<TestTableDataInterface>[] = [...]`

Example:

```javascript
<EndlessTable columns={columns} data={data} />
```

Under the hood, table is using Endless list (react-window), but the **default** look is adapted to look like
Material table. That is achieved using **ref-s**, and some manual calculation for row heights. Namely, virtualized list
expects _rowHeight_ and _tableHeight_ so that it can calculate how many elements should render initially and what happens
on scroll.

If _rowHeight_ is omitted, the table will use default row height which is _52px_. If table height is omitted, the table
will have height which is calculated based on the row height and number of rows. `That means all rows will be rendered, and the table will not be virtualized!!`

Example:

```javascript
// first row height is 150px, others are 52px
const getRowSize = (index: number) => {
if (index === 0) {
  return 150;
}
return 52;
};
const tableConfig: TableConfigInterface = {
  tableHeight: 400
}
const rowConfig: RowConfigInterface = {
  rowSize: getRowSize
}

<EndlessTable
  columns={columns}
  data={data}
  rowConfig={rowConfig}
  tableConfig={tableConfig}
/>
```

#### Drag and drop

Endless Table uses `react-dnd` as a drag and drop functionality provider. To enable drag and drop, the table has to
be wrapped by the react-dnd provider. Good practice is to wrap the entire app (the main component), so react-dnd can be
used anywhere in the app (there are no downsides for this).

Example:

```javascript
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>{children}</DndProvider>;
```

After this, the table still needs more configurations in order to make rows or cells draggable / droppable. This
configuration can be passed through already mentioned `rowConfig` and `cellConfig` properties:

```javascript
const isRowDraggable = (rowItem, startIndex) => {
  return rowItem.id !== '2';
};
const getRowSize = () => 48;
const isCellDroppable = (rowItem, startIndex) => startIndex !== 0;
const isCellDraggable = (rowItem: unknown, startIndex: number) => startIndex !== 0;

const rowConfig: RowConfigInterface = {
  draggableRow: isRowDraggable,
  rowSize: getRowSize
};
const cellConfig: CellConfigInterface = {
  draggableCell: isCellDraggable,
  droppableCell: isCellDroppable
};
```

_NOTE: if the row in a table is draggable, the cells are automatically not draggable / droppable, even if the config is
passed. That means a single table can either have draggable / droppable rows or cells. However, it is possible to drag
row from the 1st table to the 2nd table cell!!_
_TODO: think about this approach:_

##### onDrop

If the table has either draggable rows or cells, this callback should be provided to capture what happens on a drop.
The user can distinguish if the _onDrop_ happened on cell or on row based on `dropType: DropTypeEnum` property. There
are 3 possible drop types:

- ADD*TO_CELL - dragging from the \_row* of 1st table and dropping inside the _cell_ of another table
- REORDER*CELLS - dragging from \_cell* to _cell_ inside the same table
- REORDER*ROWS - dragging from \_row* to _row_ inside the same table

The `onDrop` method signature is:

```typescript
onDrop: (dragObject: DragObjectItemInterface<T>, endIndex: number, dropType: DropTypeEnum, dropRowId?: string) =>
  unknown;
```

where `dragObject` represents dragged row / cell item, `endIndex` is the index of the row / cell where the item is
dropped, and the `dropRowId` is the id of the row where the row / cell is dropped.

###### Drag Previews

There are 2 props which give the user a possibility to provide custom previews from the "outside":

`customTableRowPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;`
`customRowCellPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;`

If these 2 are omitted, Endless Table provides it's own default preview, which is not the same as browser's default
preview. It will create the preview based on the look of the row / cell inside the table. (It will not be transparent)

#### API

`id?: string` - table id. Should be provided when there are 2 or more tables inside the same parent component.

`cellConfig?: CellConfigInterface` - cell configuration object. Consists of _className?: string_ ,
_draggableCell?: (rowItem: unknown, startIndex: number) => boolean;_ and
_droppableCell?: (rowItem: unknown, startIndex: number) => boolean;_. The later two are explained in the previous
section, and the className is used to provide css styling (class) to the cell.

`columns: ColumnData<T>[];` - columns of the table (detailed explanation in previous sections).

`customTableRowPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;`
`customRowCellPreview?: (item: DragObjectItemInterface<T>) => React.ReactNode;` - both are explained in previous
sections

`data?: T[];` - data passed to the table (rows) - explained in previous sections.

`initialScrollOffset?: number;` - it sets the vertical scroll offset inside the virtualized list in the virtualized
table. The number is number of pixels, so the user needs to know exactly at whichi pixel is his/her desired offset.

`onCellClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, cellIIndex?: number) => void;` - this
method captures _onClick_ event for each cell and passes the _event_ itself, the _rowItem_ and the clicked cell index.

`onDrop?: ( dragObject: DragObjectItemInterface<T>, endIndex: number, dropType: DropTypeEnum, dropRowId?: string ) => unknown;` - explained in _drag and drop_ section

`onRowClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;` - this
method captures _onClick_ event for each row and passes the _event_ itself, the _rowItem_ and the clicked row index.

`onRowMouseOver?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;` - same
as _onRowCLick_ but it's triggered on _hover_ (_mouseOver_).

`onRowMouseOut?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, rowItem?: T, rowIndex?: number) => void;` - same
as _onRowMouseOver_ but it's triggered when mouse leaves the row.

`rowConfig?: RowConfigInterface;`
`tableConfig?: TableConfigInterface;` - both are explained in previous sections. Note that both _rowConifg_ and
_tableConfig_ can have `className` property. More on this in the _Styling_ section.

#### Styling

As mentioned earlier, one of the goals of this component is to be completely customizable from the "outside" - it lets
the user to do whatever he wants with the styles. This can be achieved using `className` property whic exists in the
`tableConfig`, `cellConfig` and the `rowConfig` objects.

**className** property is a `string` class which can be created using jss or standard react css. All 3 config objects
apply these styles to the _highest respective DOM element in the tree_. This means that `tableConfig` className adds
html class to the table wrapper (_Paper_) component, `rowConfig` className adds html class to the row wrapper
(_TableRow_) component, and the `cellConfig` className adds html class to the cell wrapper(_TableCell_) component. This
way the user has a possibility to apply styles to any DOM element down the tree by using css selectors like `& > div`.

#### Individual row / cell styling

Custom styles for each individual row can be provided by passing `className` property to each element of the `data`
array:

```javascript
const tableData: TestData[] = data.map((object, index) => {
  return {
    ...object,
    className: 'testClass'
  };
});
```

For each cell the user needs to provide a `className` to the _title_ and / or _value_ renderers:

```javascript
const columns: ColumnData<Test>[] = [
  {
    key: 'index',
    getTitle: () => ({
      node: <Typography className={classes.fontStyle}>#</Typography>,
      className: classes.indexCell
    }),
    getValue: (row) => ({ node: row.index, className: classes.indexCell })
  }
];
```
