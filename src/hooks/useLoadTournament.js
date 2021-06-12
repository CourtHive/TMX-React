import { useEffect, useState } from 'react';

import { tmxStore } from 'stores/tmxStore';
import { db } from 'services/storage/db';

export const useLoadTournament = (tournamentId) => {
  const storeState = tmxStore.getState();
  const selectedTournamentId = storeState.selectedTournamentId;
  const selectedTournament = storeState.records && storeState.records[selectedTournamentId];

  const [tournamentRecord, setTournamentRecord] = useState(selectedTournament);

  useEffect(() => {
    if (tournamentId && !tournamentRecord) {
      const error = () => console.log('oops');
      db.findTournament(tournamentId).then(setTournamentRecord, error);
    }
  }, [tournamentRecord, tournamentId]);

  if (tournamentRecord) {
    tmxStore.dispatch({ type: 'change tournament', payload: tournamentRecord });
  }

  return tournamentRecord;
};
