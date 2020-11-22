import { env } from 'config/defaults';
import { db } from 'services/storage/db';
import { context } from 'services/context';
import { showContent } from 'services/screenSlaver';
import { versionCheck } from 'functions/versioning/versionCheck';

import { initAuth } from 'services/tournamentAuthorization';
import { tmxStore } from 'stores/tmxStore';

export function displayTournament({ tournamentId, tournament, editing } = {}) {
  if (context.tournamentId && context.tournamentId !== tournamentId) {
    context.ee.emit('emitTmx', {
      action: 'leaveTournament',
      payload: { tournamentId: context.tournamentId }
    });
  }
  context.currentTab = 'tournament';
  context.tournamentId = tournamentId;

  function go(t) {
    if (!t) return;
    const tourney = versionCheck.tournament(t);

    const orgAbbr = env.org.abbr;
    const org = tourney.unifiedTournamentId?.organisation;
    const isTourneyOrg = org?.organisationAbbreviation === orgAbbr;
    if (isTourneyOrg || !org.organisationId) {
      editing = true;
    }

    const tournament = {};
    Object.assign(tournament, tourney);

    if (!tournament.unifiedTournamentId) tournament.unifiedTournamentId = {};
    if (!tournament.unifiedTournamentId?.organisation) {
      tournament.unifiedTournamentId.organisation = {
        organisationId: env.org.ouid,
        organisationName: env.org.name,
        organisationAbbreviation: env.org.abbr
      };
    }

    context.ee.emit('emitTmx', { action: 'joinTournament', payload: { tournamentId } });
    tmxStore.dispatch({ type: 'change tournament', payload: tournament });

    initAuth({ tournament });

    if (editing) {
      tmxStore.dispatch({ type: 'edit state', payload: true });
      context.state.edit = true;
    }

    showContent('tournament');
    context.currentTab = 'tournament';
  }

  if (tournament) {
    go(tournament);
  } else {
    db.findTournament(tournamentId).then(go);
  }
}

export function editTournament({ tournamentId, tournament }) {
  displayTournament({ tournamentId, tournament, editing: true });
}
