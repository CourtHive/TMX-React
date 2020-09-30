import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../styles';

import { Breadcrumbs, Grid, Link } from '@material-ui/core';
import { SignedInSelector } from 'components/selectors/SignedInSelector';
import { ParticipantView } from 'components/selectors/ParticipantView';

import { PlayersTable } from 'components/tables/playersTable/PlayersTable';
import { TeamsTable } from 'components/tables/teamsTable/TeamsTable';
import { GroupsTable } from 'components/tables/groupsTable/GroupsTable';

import { PTAB_PLAYERS, PTAB_TEAMS, PTAB_GROUPS, PTAB_OFFICIALS } from 'stores/tmx/types/tabs';

export const PlayersPanel = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const participantView = useSelector((state: any) => state.tmx.visible.participantView);

  return (
    <div>
      <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="primary" className={classes.link}>
              {t('Participants')}
            </Link>
            <ParticipantView />
            {participantView === PTAB_PLAYERS && <SignedInSelector />}
          </Breadcrumbs>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container direction="row" justify="flex-end"></Grid>
        </Grid>
      </Grid>
      <div className={classes.divider} />
      <div style={{ backgroundColor: 'white', width: '100%' }}>
        {participantView !== PTAB_PLAYERS ? null : <PlayersTable />}
        {participantView !== PTAB_TEAMS ? null : <TeamsTable />}
        {participantView !== PTAB_GROUPS ? null : <GroupsTable />}
        {participantView !== PTAB_OFFICIALS ? null : 'Officials'}
      </div>
    </div>
  );
};
