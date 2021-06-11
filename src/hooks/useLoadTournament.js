import { useEffect } from 'react';

import { db } from 'services/storage/db';
import { tmxStore } from 'stores/tmxStore';

export const useLoadTournament = (tournament, tournamentId) => {
  console.log({ tournament, tournamentId });
  useEffect(() => {
    if (tournamentId && !tournament) {
      const error = () => console.log('oops');
      const go = (tournamentRecord) => {
        console.log('change tournament');
        tmxStore.dispatch({ type: 'change tournament', payload: tournamentRecord });
      };
      db.findTournament(tournamentId).then(go, error);
    }
  }, [tournament, tournamentId]);
};
