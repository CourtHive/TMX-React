import { context } from 'services/context';
import { fetchFx } from 'services/communications/Axios/fetchFx';
import { updateCalendar } from 'services/storage/updateCalendar';
import { invalidURLorNotShared } from 'services/notifications/invalid';
import { fetchGoogleSheet } from 'services/communications/Axios/fetch/fetchGoogleSheet';

import i18n from 'i18next';
import { tmxStore } from 'stores/tmxStore';

import { AppToaster } from 'services/notifications/toaster';
import { tournamentEngine } from 'tods-competition-factory';

export function receiveRegisteredPlayers(data) {
  const players = (data && data.registered && data.registered.map(playerAttributes)) || [];
  addRegistered(players);

  function playerAttributes(p) {
    const firstName = p.fullName.split(' ').slice(1).join(' ');
    const lastName = p.fullName.split(' ')[0];
    const category_ranking = Number(p.rank) > 0 ? Number(p.rank) : undefined;
    return {
      id: p.id,
      last_name: lastName,
      first_name: firstName,
      sex: p.sex,
      category_ranking,
      club_code: p.club,
      club_name: p.club
    };
  }
}

function addRegistered(registeredPlayers) {
  registeredPlayers = registeredPlayers.filter((r) => !r.allowed || (r.allowed !== 0 && r.allowed !== false));

  tmxStore.dispatch({
    type: 'tournamentEngine',
    payload: {
      methods: [
        {
          method: 'mergeParticipants',
          params: { participants: registeredPlayers }
        }
      ]
    }
  });
}

export function updateRegisteredPlayers({ show_notice, onlyIfPopulated, renew, callback }) {
  if (!context.state.edit) return;
  const { tournamentRecord } = tournamentEngine.getState();
  const done = (result) => {
    const registeredPlayers = result && result.players;
    const teams = result && result.teams;

    if (onlyIfPopulated && !registeredPlayers) renew = false;

    if (renew) {
      // for team events approved contains team ids, not player ids.
      /*
         const approved = [];
         console.log('check if players entered into events')
         let registered_ids = (registeredPlayers && registeredPlayers.map(p=>p.id)) || [];
         // filter out all players who aren't approved in events
         tournament.players = tournament.players
            .filter(p => approved.indexOf(p.id) >= 0 || active.indexOf(p.id) >= 0 || registered_ids.indexOf(p.id) >= 0);
         */
    }

    if (registeredPlayers && registeredPlayers.length) {
      addRegistered(registeredPlayers);
      // teamsFx.checkAutoCreateTeams({ tournament });
      if (callback && typeof callback === 'function') callback(true);
    } else {
      if (registeredPlayers && !registeredPlayers.length) {
        if (show_notice) tournamentRecord.players = [];
      }
    }
    context.ee.emit('mergeTeams', {
      tournament: tournamentRecord,
      teams,
      callback: () => {
        context.ee.emit('playersTab');
      }
    });
  };
  const notConfigured = (err) => {
    const message = (err && err.error) || i18n.t('phrases.notconfigured');
    AppToaster.show({ icon: 'error', intent: 'error', message });
  };

  // TODO: legacy...
  const registered = tournamentRecord?.registration?.registered || tournamentRecord.reg_link;
  if (registered) {
    fetchGoogleSheet(registered).then(done, invalidURLorNotShared);
  } else {
    const tournamentId = tournamentRecord.unifiedTournamentId?.tournamentId || tournamentRecord.tournamentId;
    // TODO: category needs to be updated...
    fetchFx
      .fetchRegisteredPlayers({ tournamentId, category: tournamentRecord.category, show_notice })
      .then(done, notConfigured);
  }
}

// This is TSS specific
export function receiveTournamentCalendar(data) {
  const tournaments = (data && data.tournaments.map(trnyAttributes)) || [];
  updateCalendar({ merge: true, tournaments });

  function trnyAttributes(t) {
    return {
      categories: [{ categoryName: t.age, type: 'AGE' }],
      genders: [t.gender],
      endDate: makeDate(t.finish),
      name: `${t.name} - ${t.gender}`,
      startDate: makeDate(t.start),
      tournamentId: `TSS${t.tid}`
    };
  }

  function makeDate(d) {
    return d.split('.').reverse().join('-');
  }
}
