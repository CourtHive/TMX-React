import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import ScheduleContainer from 'containers/schedule/ScheduleContainer';
import { VenuesNotice } from 'components/notices/VenuesNotice';
import { PanelSelector } from 'components/selectors/PanelSelector';

// import { DaySelector } from 'components/selectors/DaySelector';
// import { DrawSelector } from 'components/selectors/DrawSelector';
// import { RoundSelector } from 'components/selectors/RoundSelector';
import { useStyles } from 'components/panels/styles';
import { TAB_SCHEDULE } from 'stores/tmx/types/tabs';

export const SchedulePanel = ({ tournamentId }) => {
  // const editState = useSelector((state: any) => state.tmx.editState);
  const classes = useStyles();

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const venues = tournamentRecord.venues || [];
  const hasCourts =
    venues &&
    venues.length &&
    venues.reduce((hasCourts, venue) => {
      return hasCourts || (venue.courts && venue.courts.length);
    }, undefined);

  const OptionsPanel = () => (
    <Grid className={classes.panelContainer} container spacing={2} direction="row" justify="space-between">
      <Grid item>
        {!hasCourts ? null : (
          <Grid container spacing={2}>
            {/* DO NOT DELETE, NEEDS TO BE IMPLEMENTED AND CONDITIONALLY DISPLAYED */}
            {/*<Grid item xs={12} sm="auto">*/}
            {/*  <DaySelector />*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm="auto">
              {/* <DrawSelector /> */}
            </Grid>
            <Grid item xs={12} sm="auto">
              {/* <RoundSelector /> */}
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item></Grid>
    </Grid>
  );

  return (
    <>
      <Grid container item justify="flex-start">
        <PanelSelector tournamentId={tournamentId} contextId={TAB_SCHEDULE} />
      </Grid>
      {!hasCourts ? null : <OptionsPanel />}
      {!hasCourts ? null : <ScheduleContainer />}
      {hasCourts ? null : <VenuesNotice />}
    </>
  );
};
