import { useEffect, useState } from 'react';

import { db } from 'services/storage/db';
import { tmxStore } from 'stores/tmxStore';

export const useLoadTournament = (tournament, tournamentId) => {
  const [tournamentRecord, setTournamentRecord] = useState();
  const dbLoaded = tmxStore.getState().tmx.dbLoaded;
  useEffect(() => {
    if (tournamentId && dbLoaded && !tournament) {
      const error = () => console.log('oops');
      db.findTournament(tournamentId).then(setTournamentRecord, error);
    }
  }, [tournament, tournamentId, dbLoaded]);

  if (tournamentRecord) {
    tmxStore.dispatch({ type: 'change tournament', payload: tournamentRecord });
  }
};
