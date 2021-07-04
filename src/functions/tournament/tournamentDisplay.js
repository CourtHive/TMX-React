import { tabRoute } from 'components/tournament/tabRoute';
import { context } from 'services/context';
import { tmxStore } from 'stores/tmxStore';
import { db } from 'services/storage/db';
import { env } from 'config/defaults';

import { TAB_EVENTS } from 'stores/tmx/types/tabs';

export function displayTournament({ tournamentId, tournament, editing, history } = {}) {
  if (tournamentId) {
    if (history) {
      const nextRoute = tabRoute({ tournamentId, tabIndex: TAB_EVENTS });
      history.push(nextRoute);
    }
    context.ee.emit('emitTmx', {
      action: 'leaveTournament',
      payload: { tournamentId: context.tournamentId }
    });
  }
  context.currentTab = 'tournament';
  context.tournamentId = tournamentId;

  function go(tourney) {
    if (!tourney) return;

    const orgAbbr = env.org.abbr;
    const org = tourney.unifiedTournamentId?.organisation;
    const isTourneyOrg = org?.organisationAbbreviation === orgAbbr;
    if (isTourneyOrg || !org?.organisationId) {
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

    if (editing) {
      tmxStore.dispatch({ type: 'edit state', payload: true });
      context.state.edit = true;
    }

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
