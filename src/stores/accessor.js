import { tmxStore } from './tmxStore';

export function getTournamentRecord() {
  const selectedTournamentId = tmxStore.getState().tmx.selectedTournamentId;
  if (selectedTournamentId) {
    return tmxStore.getState().tmx.records[selectedTournamentId];
  }
}
