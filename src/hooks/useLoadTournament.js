import { useEffect } from 'react';

import { tmxStore } from 'stores/tmxStore';
import { db } from 'services/storage/db';

export const useLoadTournament = (tournament, tournamentId) => {
  /*
  const storeState = tmxStore.getState();
  const selectedTournamentId = storeState.selectedTournamentId;
  const selectedTournament = storeState.records && storeState.records[selectedTournamentId];
  */

  function changeTournament(newTournament) {
    tmxStore.dispatch({ type: 'change tournament', payload: newTournament });
  }

  useEffect(() => {
    if (tournamentId && !tournament) {
      const error = () => console.log('oops');
      db.findTournament(tournamentId).then(changeTournament, error);
    }
  }, [tournament, tournamentId]);

  return tournament;
};
