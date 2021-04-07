import { db } from 'services/storage/db';
import { context } from 'services/context';
import { tmxStore } from 'stores/tmxStore';

export function populateCalendar() {
  db.findAllTournaments().then((tournaments) => {
    const filteredTournaments = filterCalendar(tournaments);
    context.ee.emit('refreshTournaments', filteredTournaments);
  });
}

function getTournamentId(tournament) {
  return tournament.unifiedTournamentId?.tournamentId || tournament.tournamentId;
}

export function filterCalendar(tournaments = []) {
  const myTournaments = tmxStore.getState().tmx.myTournaments || [];
  const myTournamentIds = myTournaments.map(getTournamentId);
  const filteredTournaments = tournaments.filter(
    (tournament) => !myTournamentIds.length || myTournamentIds.includes(getTournamentId(tournament))
  );

  return filteredTournaments;
}
