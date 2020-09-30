import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import StandardPaper from 'components/papers/standard/StandardPaper';
import UpcomingMatchUpsTableResource, { AssignedMatch } from 'components/scheduleDisplay/UpcomingMatchUpsTableResource';
import UpcomingMatchesCourtSchedule, {
  UMScheduleTableDataType,
  UMTableDataType,
  UpcomingMatchUpType
} from 'components/scheduleDisplay/UpcomingMatchesCourtSchedule';
import UMTableDragHandleCell from 'components/scheduleDisplay/UMTableDragHandleCell';
import EndlessTable, { ColumnData } from 'components/tables/EndlessTable';
import {
  CellConfigInterface,
  DragObjectItemInterface,
  DropTypeEnum,
  RowConfigInterface,
  TableConfigInterface
} from 'components/tables/EndlessTable/typedefs';
import UMCourtScheduleFirstColumnCell from 'components/scheduleDisplay/UMCourtScheduleFirstColumnCell';
import UMCourtScheduleTitle from 'components/scheduleDisplay/UMCourtScheduleTitle';
import { useStyles } from 'containers/schedule/styles';
import SideCell from 'components/scheduleDisplay/SideCell';
import { useStyles as useStylesTable } from 'components/tables/styles';

import { scheduleOnDrop } from './scheduleOnDrop';
import { convertMatchUpsToRows, matchUpAsRow } from 'containers/schedule/convertMatchUpsToRows';
import { competitionEngine, drawEngine } from 'tods-competition-factory';
import { CourtType } from 'typedefs/store/scheduleTypes';
// import { formatDate } from 'functions/dateTime';

const ScheduleContainer: React.FC = () => {
  const classes = useStyles();
  const classesTable = useStylesTable();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const editState = useSelector((state: any) => state.tmx.editState);

  const tournamentRecords = useSelector((state: any) => state.tmx.records);
  competitionEngine.setState(tournamentRecords);

  // TODO: scheduledDate selector should set this value
  // const dateSelected = formatDate(new Date());
  const dateSelected = '2020-07-12';

  const matchUpFilters = { isMatchUpTie: false, scheduledDate: dateSelected };
  const { dateMatchUps, courtsData, venues } = competitionEngine.competitionScheduleMatchUps({ matchUpFilters });

  // TODO: use venues to populate venues filter
  // TODO: perhaps add contextFilter venuId to filter out matchUps that are scheduled at venues other than selected venue
  console.log({ courtsData, venues });

  // We have to add placeholder with 'empty' court (which is not a court, just an array element) in order to make
  // drag/drop functionality work properly

  const firstColumnCourtsTable: ColumnData<UMScheduleTableDataType>[] = [
    {
      key: 'courts-column-1',
      getTitle: () => ({ node: '', className: classes.firstColumnCourtsTable }),
      getValue: (data) => {
        const text = data.id === '1' ? t('On Now') : t('Up Next');
        return {
          node: <UMCourtScheduleFirstColumnCell data={data} text={text.toUpperCase()} />
        };
      }
    }
  ];

  const sideClick = ({ matchUpId, participantId }) => {
    if (!editState) return;
    const matchUpContextIds = drawEngine.getMatchUpContextIds({ matchUps: dateMatchUps, matchUpId });
    const payload = Object.assign(matchUpContextIds, { participantId });
    dispatch({
      type: 'competitionEngine',
      payload,
      method: 'toggleParticipantCheckInState'
    });
  };
  const removeCourtAssignment = (matchUpId) => {
    if (!editState) return;
    const matchUpContextIds = drawEngine.getMatchUpContextIds({ matchUps: dateMatchUps, matchUpId });
    dispatch({
      type: 'competitionEngine',
      payload: matchUpContextIds,
      method: 'removeMatchUpCourtAssignment'
    });
  };
  const courtsUMSchedule: ColumnData<UMScheduleTableDataType>[] = courtsData.map((court, index) => ({
    key: `${court.courtId || index}`,
    getTitle: () => ({
      node: <UMCourtScheduleTitle title={court.courtName} subtitle={court.surfaceCategory} />,
      className: classes.courtTitle
    }),
    getValue: (row) => ({
      node: (
        <UpcomingMatchUpsTableResource removeAssignment={removeCourtAssignment} courtId={court.courtId} rowData={row} />
      )
    })
  }));
  const columnsUMSchedule = [...firstColumnCourtsTable, ...courtsUMSchedule];

  const columnsUMTable: ColumnData<UMTableDataType>[] = [
    {
      key: 'index',
      getTitle: () => ({
        node: <Typography className={classesTable.headerFontStyle}>#</Typography>,
        className: classes.UMTableIndexCell
      }),
      getValue: (row) => ({ node: row.index, className: classes.UMTableIndexCell })
    },
    {
      key: 'drag',
      getTitle: () => ({ node: '', className: classes.UMTableDragHandleCell }),
      getValue: (row) => ({
        node: <UMTableDragHandleCell courtId={Boolean(row.schedule?.courtId)} />,
        className: classes.UMTableDragHandleCell,
        isDragHandle: true
      })
    },
    {
      key: 'time',
      getTitle: () => ({
        node: <Typography className={classesTable.headerFontStyle}>{t('time')}</Typography>,
        className: classes.UMTableCellTime
      }),
      getValue: (row) => ({ node: row.time })
    },
    {
      key: 'eventName',
      getTitle: () => ({ node: <Typography className={classesTable.headerFontStyle}>{t('ent')}</Typography> }),
      getValue: (row) => ({ node: row.eventName })
    },
    {
      key: 'round',
      getTitle: () => ({
        node: <Typography className={classesTable.headerFontStyle}>{t('rnd')}</Typography>,
        className: classes.UMTableCellNoWrap
      }),
      getValue: (row) => ({ node: row.round })
    },
    {
      key: 'side1',
      getTitle: () => ({
        node: <Typography className={classesTable.headerFontStyle}>{t('Side 1')}</Typography>,
        className: classes.UMTableCellSides
      }),
      getValue: (row) => ({ node: <SideCell rowItem={row} handleCellClick={sideClick} isSide1 /> })
    },
    {
      key: 'side2',
      getTitle: () => ({
        node: <Typography className={classesTable.headerFontStyle}>{t('Side 2')}</Typography>,
        className: classes.UMTableCellSides
      }),
      getValue: (row) => ({ node: <SideCell handleCellClick={sideClick} rowItem={row} /> })
    }
  ];

  const appendOnNowMatchUp = (courts) => {
    return courts.map((court) => {
      const incomplete = (court.matchUps || []).filter((m) => !m.winningSide);
      return {
        ...court,
        matchUp: matchUpAsRow(incomplete[0], 0)
      };
    });
  };

  const appendUpNextMatchUp = (courts) => {
    return courts.map((court) => {
      const incomplete = (court.matchUps || []).filter((m) => !m.winningSide);
      return {
        ...court,
        matchUp: matchUpAsRow(incomplete[1], 1)
      };
    });
  };

  const onNowCourts = [
    {
      courtName: '',
      courtId: 'empty-column-1-on-now',
      dateAvailability: []
    },
    ...appendOnNowMatchUp(courtsData)
  ] as CourtType[];

  const upNextCourts = [
    {
      courtName: '',
      courtId: 'empty-column-1-up-next',
      dateAvailability: []
    },
    ...appendUpNextMatchUp(courtsData)
  ];

  const latestViewScheduleData = [
    { id: '1', courts: onNowCourts },
    { id: '2', courts: upNextCourts }
  ];

  const upcomingMatchUpsData: UMTableDataType[] = convertMatchUpsToRows(dateMatchUps);

  const getRowSize = () => 48;
  const isRowDraggable = (rowItem) => {
    return editState && !rowItem.schedule?.courtId;
  };

  const cellConfig: CellConfigInterface = {
    className: classes.UMCellConfig
  };
  const rowConfig: RowConfigInterface = {
    draggableRow: isRowDraggable,
    rowSize: getRowSize
  };
  const tableConfig: TableConfigInterface = {
    className: classes.UMTableConfig,
    tableHeight: 300
  };

  const handleRowClick = (event, rowItem, rowIndex) => {
    console.log('rowClick', { rowItem, event, rowIndex });
  };
  const handleCellClick = (event, rowItem, cellIndex) => {
    console.log('cellClick', { rowItem, cellIndex, event });
  };
  const renderTableRowPreview = (draggedObject: DragObjectItemInterface<UMTableDataType>) => {
    const matchUp = draggedObject.item as UpcomingMatchUpType;
    return <AssignedMatch matchUp={matchUp} />;
  };

  const onDropUMTable = (
    dragObject: DragObjectItemInterface<UMTableDataType | UMScheduleTableDataType>,
    endIndex: number,
    dropType: DropTypeEnum,
    dropRowId: string
  ) => {
    scheduleOnDrop(dragObject, dropType, dropRowId, endIndex, dispatch, dateSelected, dateMatchUps);
  };

  const onDropUMSchedule = (
    dragObject: DragObjectItemInterface<UMTableDataType | UMScheduleTableDataType>,
    endIndex: number,
    dropType: DropTypeEnum,
    dropRowId: string
  ) => {
    scheduleOnDrop(
      dragObject,
      dropType,
      dropRowId,
      endIndex,
      dispatch,
      dateSelected,
      dateMatchUps,
      latestViewScheduleData
    );
  };

  const foo = true;
  if (foo) return null;

  return (
    <>
      <UpcomingMatchesCourtSchedule
        columns={columnsUMSchedule}
        data={latestViewScheduleData}
        handleRowClick={editState && handleRowClick}
        onDrop={editState && onDropUMSchedule}
      />
      <div className={classes.divider} />
      <StandardPaper>
        <Typography variant="h1" className={classesTable.tablePaperTitle}>
          {t('Upcoming matches')}
        </Typography>
        <EndlessTable
          cellConfig={cellConfig}
          columns={columnsUMTable}
          customTableRowPreview={renderTableRowPreview}
          data={upcomingMatchUpsData}
          id={'upcomingMatchesTable'}
          onDrop={editState && onDropUMTable}
          onCellClick={editState && handleCellClick}
          onRowClick={editState && handleRowClick}
          rowConfig={rowConfig}
          tableConfig={tableConfig}
        />
      </StandardPaper>
    </>
  );
};

export default ScheduleContainer;
