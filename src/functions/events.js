import { drawDefinitionConstants } from 'tods-competition-factory';
const { DIRECT_ACCEPTANCE } = drawDefinitionConstants;

export function getEntries(event) {
  const getParticipantId = (entry) => entry.participantId || (entry.participant && entry.participant.participantId);
  const participantIds = (event.entries && event.entries.map(getParticipantId)) || [];
  return { participantIds };
}

export function getStatusGroup({ selectedEvent, status = DIRECT_ACCEPTANCE }) {
  const entries = selectedEvent.entries || [];
  const confirmedEntries = entries.filter(
    (e) => (e.entryStatus || '').toLowerCase() === (status || '').toLowerCase() && status !== ''
  );
  const approved = confirmedEntries.map((e) => e.participantId).filter((f) => f);
  return approved;
}
