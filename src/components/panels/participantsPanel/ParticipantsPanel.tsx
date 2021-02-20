import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from '../styles';

import { Breadcrumbs, Grid } from '@material-ui/core';
import { SignedInSelector } from 'components/selectors/SignedInSelector';
import { ParticipantView } from 'components/selectors/ParticipantView';

import { PlayersTable } from 'components/tables/playersTable/PlayersTable';
import { TeamsTable } from 'components/tables/teamsTable/TeamsTable';
import { GroupsTable } from 'components/tables/groupsTable/GroupsTable';
import NoticePaper from 'components/papers/notice/NoticePaper';
import { PanelSelector } from 'components/selectors/PanelSelector';

import { PTAB_PARTICIPANTS, PTAB_TEAMS, PTAB_GROUPS, PTAB_OFFICIALS, TAB_PARTICIPANTS } from 'stores/tmx/types/tabs';

export const PlayersPanel = ({ tournamentId }) => {
  const classes = useStyles();

  const participantView = useSelector((state: any) => state.tmx.visible.participantView);

  return (
    <div>
      <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb">
            <PanelSelector tournamentId={tournamentId} contextId={TAB_PARTICIPANTS} />
            <ParticipantView />
            {participantView === PTAB_PARTICIPANTS && <SignedInSelector />}
          </Breadcrumbs>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container direction="row" justify="flex-end"></Grid>
        </Grid>
      </Grid>
      <NoticePaper className={'header'} style={{ marginTop: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Participant Statistics:</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              Actions
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
      <div className={classes.divider} />
      <div style={{ backgroundColor: 'white', width: '100%' }}>
        {participantView !== PTAB_PARTICIPANTS ? null : <PlayersTable />}
        {participantView !== PTAB_TEAMS ? null : <TeamsTable />}
        {participantView !== PTAB_GROUPS ? null : <GroupsTable />}
        {participantView !== PTAB_OFFICIALS ? null : 'Officials'}
      </div>
    </div>
  );
};
