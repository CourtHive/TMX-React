function getTournaments(m) {
  return (m && m.tournaments && typeof m.tournaments === 'object' && m.tournaments) || {};
}

// TODO: tournamentId => unifiedTournamentId

export function transformEventBroadcast({ ebo, env }) {
  const tournaments = getTournaments(env.middleware);
  const tournament = tournaments[ebo.tournament.tournamentId];
  if (tournament?.redirectEvents?.tournamentId) {
    ebo.tournament.tournamentId = tournament.redirectEvents.tournamentId;
  }
  return ebo;
}

export function transformDeleteEvent({ deleteRequest, env }) {
  const tournaments = getTournaments(env.middleware);
  const tournament = tournaments[deleteRequest.tournamentId];
  if (tournament?.redirectEvents?.tournamentId) {
    deleteRequest.tournamentId = tournament.redirectEvents.tournamentId;
  }
  return deleteRequest;
}
