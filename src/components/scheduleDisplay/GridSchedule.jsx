import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { useStylesCommon } from 'components/scheduleDisplay/styles';
import StandardPaper from 'components/papers/standard/StandardPaper';
import EndlessTable from 'components/tables/EndlessTable';

import { AssignedMatchUp } from 'components/scheduleDisplay/AssignedMatchUp';

const isCellDroppable = (rowItem, startIndex) => startIndex !== 0;

const GridSchedule = ({ columns, data, handleRowClick, onDrop }) => {
  const classes = useStylesCommon();
  const editState = useSelector((state) => state.tmx.editState);

  const isCellDraggable = (rowItem, startIndex) => {
    const umScheduleDataItem = rowItem;
    const draggedCourt = umScheduleDataItem?.courts[startIndex];
    return editState && !!draggedCourt?.matchUp;
  };

  const cellConfig = {
    className: classes.UMCourtSchedule,
    draggableCell: isCellDraggable,
    droppableCell: isCellDroppable
  };
  const getRowSize = (index) => {
    if (index === 0) {
      return 150;
    }
    if (index === 1) {
      if (data[1]?.courts?.find((court) => court?.matchUp)) {
        return 150;
      }
      return 50;
    }
    return 52;
  };
  const rowConfig = {
    rowSize: getRowSize
  };
  const tableConfig = {
    className: classes.UMCourtsTableConfig,
    tableHeight: getRowSize(0) + getRowSize(1)
  };

  const renderRowCellPreview = (draggedObject) => {
    const courts = draggedObject.item.courts;
    const matchUp = courts[draggedObject.startIndex]?.matchUp;
    return <AssignedMatchUp matchUp={matchUp} />;
  };

  const handleCellClick = (rowItem, cellIndex, event) => {
    console.log(rowItem, cellIndex, event);
  };
  return (
    <StandardPaper className={classes.paper}>
      <Grid
        alignItems="center"
        className={classes.paperHeaderContainer}
        container
        direction="row"
        justify="space-between"
      >
        <Grid item></Grid>
        <Grid item></Grid>
      </Grid>
      <EndlessTable
        cellConfig={cellConfig}
        columns={columns}
        customRowCellPreview={renderRowCellPreview}
        data={data}
        id="upcomingMatchesSchedule"
        onCellClick={handleCellClick}
        onDrop={onDrop}
        onRowClick={handleRowClick}
        rowConfig={rowConfig}
        tableConfig={tableConfig}
      />
      <Grid
        alignItems="center"
        className={classes.paperHeaderContainer}
        container
        direction="row"
        justify="space-between"
      >
        <Grid item></Grid>
      </Grid>
    </StandardPaper>
  );
};

export default GridSchedule;
