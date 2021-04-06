import React, { useEffect } from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'services/storage/db';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { context } from 'services/context';
import { env } from 'config/defaults';

import { tournamentEngine } from 'tods-competition-factory';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;
  const dispatch = useDispatch();

  const dbLoaded = useSelector((state: any) => state.tmx.dbLoaded);
  const { tournamentRecord } = tournamentEngine.getState();
  const tournamentId = match?.params?.tournamentId;

  useEffect(() => {
    function go(tournament) {
      dispatch({ type: 'change tournament', payload: tournament });
      const org = tournament?.unifiedTournamentId?.organisation || tournament?.org?.abbr;
      const isTourneyOrg = org?.organisationAbbreviation === env.org.abbr;
      const editing = isTourneyOrg || !org?.organisationId;
      if (editing) {
        dispatch({ type: 'edit state', payload: true });
        context.state.edit = true;
      }
    }
    if (!tournamentRecord && tournamentId && dbLoaded) {
      db.findTournament(tournamentId).then(go, () => {
        console.log('oops');
      });
    }
  }, [dbLoaded, dispatch, tournamentId, tournamentRecord]);

  return tournamentRecord ? (
    <TournamentRoot tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
};

export default TournamentPage;
