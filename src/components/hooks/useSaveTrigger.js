import { save } from 'services/storage/save';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export function useSaveTrigger() {
  const [saved, modifySaved] = useState();

  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);

  const saveCount = useSelector((state) => state.tmx.saveCount);

  if (
    saveCount !== saved &&
    (tournamentRecord?.tournamentId || // remove after full migration to unifiedTournamentId
      tournamentRecord?.unifiedTournamentId?.tournamentId)
  ) {
    modifySaved(saveCount);
  }

  save.local({ tournament: tournamentRecord });
}
