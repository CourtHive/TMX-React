import { env } from 'config/defaults';
import { context } from 'services/context';
import { coms } from 'services/communications/SocketIo/coms';

import { tmxStore } from 'stores/tmxStore';
import { tournamentEngine } from 'tods-competition-factory';

export function setUserAuth({ authorized, initialize }) {
  const { tournamentRecord } = tournamentEngine.getState();
  const tournamentId = tournamentRecord?.unifiedTournamentId?.tournamentId || tournamentRecord?.tournamentId;

  const changed = (context.state.authorized && !authorized) || (!context.state.authorized && authorized);
  context.state.authorized = authorized || false;
  tmxStore.dispatch({ type: 'tournament auth state', payload: context.state.authorized });

  if (changed || initialize) {
    // set up to receive delegated scores
    context.ee.emit('emitTmx', { action: 'joinTournament', payload: { tournamentId } });
  }
}

function authorizeAndInitialize(result) {
  result.initialize = true;
  setUserAuth(result);
}

export function receiveAuth(t) {
  const { tournamentRecord } = tournamentEngine.getState();
  const tournamentId = tournamentRecord?.unifiedTournamentId?.tournamentId || tournamentRecord?.tournamentId;
  const authTournamentId = t?.unifiedTournamentId?.tournamentId || t?.tournamentId;
  const authorized = tournamentId && authTournamentId === tournamentId;
  setUserAuth({ authorized });
}

export function initAuth({ tournament }) {
  const organisationId = env.org?.ouid;
  const tournamentId = tournament.unifiedTournamentId?.tournamentId || tournament.tournamentId;
  if (organisationId && tournamentId) {
    coms.emitTmx({ action: 'getUserAuth', payload: { tournamentId } }, authorizeAndInitialize);
  } else {
    console.log('AUTH INIT', { organisationId, tournamentId });
  }
}
