import React, { useEffect } from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'services/storage/db';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { context } from 'services/context';
import { env } from 'config/defaults';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;
  const dispatch = useDispatch();

  const dbLoaded = useSelector((state: any) => state.tmx.dbLoaded);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const tournamentId = match?.params?.tournamentId;

  useEffect(() => {
    function go(tournamentRecord) {
      dispatch({ type: 'change tournament', payload: tournamentRecord });
      const org = tournamentRecord?.unifiedTournamentId?.organisation || tournamentRecord?.org?.abbr;
      const isTourneyOrg = org?.organisationAbbreviation === env.org.abbr;
      const editing = isTourneyOrg || !org?.organisationId;
      if (editing) {
        dispatch({ type: 'edit state', payload: true });
        context.state.edit = true;
      }
    }
    if (tournamentId && dbLoaded) {
      db.findTournament(tournamentId).then(go, () => {
        console.log('oops');
      });
    }
  }, [dbLoaded, dispatch, tournamentId]);

  return tournamentRecord ? (
    <TournamentRoot tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
};

export default TournamentPage;
