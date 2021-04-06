import { db } from 'services/storage/db';

import { mocksEngine } from 'tods-competition-factory';

import { utilities } from 'tods-competition-factory';
const {
  UUID,
  dateTime: { futureDate }
} = utilities;

export function courtHiveChallenge() {
  const { participants: maleParticipants } = mocksEngine.generateParticipants({
    participantsCount: 16,
    matchUpType: 'DOUBLES',
    sex: 'MALE'
  });

  const { participants: femaleParticipants } = mocksEngine.generateParticipants({
    participantsCount: 16,
    matchUpType: 'DOUBLES',
    sex: 'FEMALE'
  });

  const participants = [...maleParticipants, ...femaleParticipants];

  const tournamentId = UUID();
  const tournament = {
    events: [],
    startDate: futureDate(5).getTime(),
    tournamentName: 'CourtHive Challenge',
    endDate: futureDate(7).getTime(),
    tournamentId,
    unifiedTournamentId: { tournamentId },
    participants
  };
  return db.addTournament(tournament);
}
