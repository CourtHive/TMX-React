import React from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';

import { useLoadTournament } from 'hooks/useLoadTournament';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;

  const tournamentId = match?.params?.tournamentId;
  const loadedTournament = useLoadTournament(tournamentId);

  return loadedTournament ? (
    <TournamentRoot tournamentRecord={loadedTournament} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
};

export default TournamentPage;
