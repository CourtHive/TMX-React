import { db } from 'services/storage/db';

import { tournamentEngine } from 'tods-competition-factory';

import { utilities } from 'tods-competition-factory';
const {
  UUID,
  dateTime: { futureDate }
} = utilities;

export function courtHiveChallenge() {
  const { participants: maleParticipants } = tournamentEngine.generateMockParticipants({
    participantsCount: 16,
    matchUpType: 'DOUBLES',
    sex: 'MALE'
  });

  const { participants: femaleParticipants } = tournamentEngine.generateMockParticipants({
    participantsCount: 16,
    matchUpType: 'DOUBLES',
    sex: 'FEMALE'
  });

  const participants = [...maleParticipants, ...femaleParticipants];

  const tournamentId = UUID();
  const tournament = {
    org: {},
    events: [],
    metadata: { formatVersion: 2 },
    startDate: futureDate(5).getTime(),
    name: 'CourtHive Challenge',
    endDate: futureDate(7).getTime(),
    tournamentId,
    unifiedTournamentId: { tournamentId },
    participants
  };
  return db.addTournament(tournament);
}
