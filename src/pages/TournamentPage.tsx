import React, { useEffect } from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const TournamentPage: React.FC = () => {
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournament = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const location = useLocation();
  const locationPathnameArray = location.pathname.split('/');
  const tournamentId = locationPathnameArray[locationPathnameArray.length - 1];

  useEffect(() => {
    if (!tournament) {
      console.log({ tournamentId });
      // dispatch({ type: 'change tournament', payload: tournamentFromAPI });
    }
  });

  return tournament ? (
    <TournamentRoot />
  ) : (
    <Grid alignItems="center" container justify="center">
      <CircularProgress size={100} />
    </Grid>
  );
};

export default TournamentPage;
