import { getTournamentRecord } from 'stores/accessor';

export function getParticipants() {
  const tournamentRecord = getTournamentRecord();
  return (tournamentRecord && tournamentRecord.participants) || [];
}

export function getParticipant(participantId) {
  return getParticipants().reduce((p, c) => (c && c.participantId === participantId ? c : p), undefined);
}
