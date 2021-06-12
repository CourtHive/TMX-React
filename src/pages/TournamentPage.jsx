import React from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';

import { useLoadTournament } from 'hooks/useLoadTournament';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;

  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const selectedTournament = useSelector((state) => state.tmx.records[selectedTournamentId]);

  const tournamentId = match?.params?.tournamentId;
  const loadedTournament = useLoadTournament(selectedTournament, tournamentId);

  return loadedTournament ? (
    <TournamentRoot tournamentRecord={loadedTournament} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
};

export default TournamentPage;
