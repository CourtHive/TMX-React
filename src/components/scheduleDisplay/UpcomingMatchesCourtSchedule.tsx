import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import {
  CellConfigInterface,
  DragObjectItemInterface,
  DropTypeEnum,
  RowConfigInterface,
  TableConfigInterface
} from 'components/tables/EndlessTable/typedefs';
import { CourtType } from 'typedefs/store/scheduleTypes';
import { useStylesCommon } from 'components/scheduleDisplay/styles';
import StandardPaper from 'components/papers/standard/StandardPaper';
import EndlessTable, { ColumnData, RowData } from 'components/tables/EndlessTable';

import { AssignedMatch } from 'components/scheduleDisplay/UpcomingMatchUpsTableResource';

export interface ScheduleType {
  time: string;
  courtId: string;
  startTime: string;
  endTime: string;
  milliseconds: string;
  scheduledTime: string;
}
// TODO: extract to type definitions
// ID of matchUp should be the same as row id
export interface UpcomingMatchUpType {
  id: string;
  schedule?: ScheduleType;
  checkedInParticipantIds?: string[];
  matchUpId: string;
  index: number;
  time: string;
  eventName: string;
  round: number;
  side1: string;
  side2: string;
  side1Id: string;
  side2Id: string;
}
export interface UMScheduleCourtType extends CourtType {
  courtName: string;
  matchUp?: UpcomingMatchUpType;
}

export interface UMScheduleTableDataType extends RowData {
  courts: UMScheduleCourtType[];
}

// TODO: extract to typedefs with real Data type
export interface UMTableDataType extends RowData, UpcomingMatchUpType {}

interface UpcomingMatchesCourtScheduleProps {
  columns: ColumnData<UMScheduleTableDataType>[];
  data: UMScheduleTableDataType[];
  handleRowClick?: (
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowItem?: UMScheduleTableDataType,
    rowIndex?: number
  ) => void;
  onDrop?: (
    dragObject: DragObjectItemInterface<UMScheduleTableDataType>,
    droppedItemId: number,
    dropType: DropTypeEnum,
    dropRowId?: string
  ) => unknown;
}

const isCellDroppable = (rowItem: unknown, startIndex: number) => startIndex !== 0;

const UpcomingMatchesCourtSchedule: React.FC<UpcomingMatchesCourtScheduleProps> = ({
  columns,
  data,
  handleRowClick,
  onDrop
}) => {
  const { t } = useTranslation();
  const classes = useStylesCommon();
  const editState = useSelector((state: any) => state.tmx.editState);

  const isCellDraggable = (rowItem: unknown, startIndex: number) => {
    const umScheduleDataItem = rowItem as UMScheduleTableDataType;
    const draggedCourt = umScheduleDataItem?.courts[startIndex];
    return editState && !!draggedCourt?.matchUp;
  };

  const cellConfig: CellConfigInterface = {
    className: classes.UMCourtSchedule,
    draggableCell: isCellDraggable,
    droppableCell: isCellDroppable
  };
  const getRowSize = (index: number) => {
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
  const rowConfig: RowConfigInterface = {
    rowSize: getRowSize
  };
  const tableConfig: TableConfigInterface = {
    className: classes.UMCourtsTableConfig,
    tableHeight: getRowSize(0) + getRowSize(1)
  };

  const renderRowCellPreview = (draggedObject: DragObjectItemInterface<UMScheduleTableDataType>) => {
    const courts = draggedObject.item.courts;
    const matchUp = courts[draggedObject.startIndex]?.matchUp;
    return <AssignedMatch matchUp={matchUp} />;
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
        <Grid item>
          <Grid container>
            <Grid className={classes.paperHeaderArrowsLeftRight} item>
              <Grid alignItems="center" className={classes.paperHeaderArrowsLeftRightInner} container justify="center">
                <ArrowBackIcon />
              </Grid>
            </Grid>
            <Grid className={classes.paperHeaderArrowsLeftRight} item>
              <Grid alignItems="center" className={classes.paperHeaderArrowsLeftRightInner} container justify="center">
                <ArrowForwardIcon />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
        <Grid item>
          <Typography>{t('Show full schedule')}</Typography>
        </Grid>
      </Grid>
    </StandardPaper>
  );
};

export default UpcomingMatchesCourtSchedule;
