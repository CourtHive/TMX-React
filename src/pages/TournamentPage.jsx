import React, { useEffect } from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'services/storage/db';

/*
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
*/
import { context } from 'services/context';
import { env } from 'config/defaults';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;
  const dispatch = useDispatch();

  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);
  const tournamentId = match?.params?.tournamentId;
  console.log({ tournamentId, tournamentRecord });

  useEffect(() => {
    function go(tournamentRecord) {
      console.log('change tournament');
      dispatch({ type: 'change tournament', payload: tournamentRecord });
      const org = tournamentRecord?.unifiedTournamentId?.organisation || tournamentRecord?.org?.abbr;
      const isTourneyOrg = org?.organisationAbbreviation === env.org.abbr;
      const editing = isTourneyOrg || !org?.organisationId;
      if (editing) {
        dispatch({ type: 'edit state', payload: true });
        context.state.edit = true;
      }
    }

    console.log({ tournamentId });
    if (tournamentId && !tournamentRecord) {
      console.log('find tournament');
      db.findTournament(tournamentId).then(go, () => {
        console.log('oops');
      });
    }
  }, [dispatch, tournamentId, tournamentRecord]);

  return <TournamentRoot tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={match?.params} />;
  /*
  return tournamentRecord ? (
    <TournamentRoot tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
  */
};

export default TournamentPage;
