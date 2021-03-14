import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UpcomingMatchUpsTableResource from 'components/scheduleDisplay/AssignedMatchUp';
import GridSchedule from 'components/scheduleDisplay/GridSchedule';
import GuideColumn from 'components/scheduleDisplay/GuideColumn';
import CourtColumnName from 'components/scheduleDisplay/CourtColumnName';
import { useStyles } from 'containers/schedule/styles';

import { matchUpAsRow } from 'containers/schedule/convertMatchUpsToRows';
import { competitionEngine, drawEngine } from 'tods-competition-factory';

const ScheduleContainer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const editState = useSelector((state) => state.tmx.editState);

  const tournamentRecords = useSelector((state) => state.tmx.records);
  competitionEngine.setState(tournamentRecords);

  // TODO: scheduledDate selector should set this value
  const dateSelected = '2020-07-12';

  const matchUpFilters = { isMatchUpTie: false, scheduledDate: dateSelected };
  const { dateMatchUps, courtsData } = competitionEngine.competitionScheduleMatchUps({ matchUpFilters });

  const firstColumnCourtsTable = [
    {
      key: 'courts-column-1',
      getTitle: () => ({ node: '', className: classes.firstColumnCourtsTable }),
      getValue: (data) => {
        const text = '';
        return {
          node: <GuideColumn data={data} text={text.toUpperCase()} />
        };
      }
    }
  ];

  const removeCourtAssignment = (matchUpId) => {
    if (!editState) return;
    const matchUpContextIds = drawEngine.getMatchUpContextIds({ matchUps: dateMatchUps, matchUpId });
    dispatch({
      type: 'competitionEngine',
      payload: matchUpContextIds,
      method: 'removeMatchUpCourtAssignment'
    });
  };
  const courtsUMSchedule = courtsData.map((court, index) => ({
    key: `${court.courtId || index}`,
    getTitle: () => ({
      node: <CourtColumnName title={court.courtName} subtitle={court.surfaceCategory} />,
      className: classes.courtTitle
    }),
    getValue: (row) => ({
      node: (
        <UpcomingMatchUpsTableResource removeAssignment={removeCourtAssignment} courtId={court.courtId} rowData={row} />
      )
    })
  }));
  const columnsUMSchedule = [...firstColumnCourtsTable, ...courtsUMSchedule];

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
  ];

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

  const handleRowClick = (event, rowItem, rowIndex) => {
    console.log('rowClick', { rowItem, event, rowIndex });
  };

  return (
    <>
      <GridSchedule
        columns={columnsUMSchedule}
        data={latestViewScheduleData}
        handleRowClick={editState && handleRowClick}
      />
    </>
  );
};

export default ScheduleContainer;
