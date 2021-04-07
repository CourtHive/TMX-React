import i18n from 'i18next';

import { env } from 'config/defaults';
import { isDev } from 'functions/isDev';
import { db } from 'services/storage/db';
import { context } from 'services/context';
import { envSettings } from 'config/manageSettings';
import { contentEquals } from 'services/screenSlaver';
import { editTournament } from 'functions/tournament/tournamentDisplay';
import { coms } from 'services/communications/SocketIo/coms';
import { courtHiveChallenge } from 'functions/tournament/courtHiveChallenge';

import { AppToaster } from 'services/notifications/toaster';
import { showSplash } from 'services/screenSlaver';
import { receiveAuth } from 'services/tournamentAuthorization';
import { tmxStore } from 'stores/tmxStore';

export const config = (function () {
  const fx = {};

  function addTournamentKey(tournamentKey, tournamentId) {
    function done() {
      console.log('added tournament key');
    }
    function addToKeyRing(setting = { key: 'tournamentKeys', ring: [] }) {
      setting.ring = setting.ring.filter((k) => k.key !== tournamentKey);
      if (tournamentKey && tournamentId) {
        setting.ring.push({ key: tournamentKey, tournamentId, ouid: env.org?.ouid });
        db.addSetting(setting).then(done, done);
      }
    }
    db.findSetting('tournamentKeys').then(addToKeyRing, addToKeyRing);
  }

  function dbUpgrade() {
    console.log('db upgrade close browser and re-open');
  }

  function initDB() {
    return new Promise((resolve, reject) => {
      coms.catchAsync(db.initDB)().then(envSettings, dbUpgrade).then(resolve, reject);
    });
  }

  function checkFirstTime() {
    if (env.firstTimeUser) {
      env.firstTimeUser = false;
      return true;
    }
  }

  function checkQueryString() {
    if (context.queryString.actionKey) {
      coms.queueKey(context.queryString.actionKey);
    }
  }

  function tmxMessage(msg) {
    if (msg.authorized && msg.tournamentId) {
      fx.authMessage(msg);
    } else {
      msg.notice = msg.notice || msg.tournament;
      if (msg.notice) fx.addMessage(msg);
    }
  }

  function settingsLoaded() {
    db.findSetting('defaultIdiom')
      .then((key) => {
        const ioc = (key && key.ioc) || env.ioc;
        if (ioc) context.ee.emit('changeIdiom', { ioc, initialization: true });
      })
      .catch((err) => console.log({ err }));
  }

  function initListeners() {
    context.ee.addListener('tmxMessage', tmxMessage);
    context.ee.addListener('addMessage', fx.addMessage);

    context.ee.addListener('settingsLoaded', settingsLoaded);
    context.ee.addListener('receiveTournamentRecord', (data) => console.log('receiveTournamentRecord', data));
  }

  fx.init = () => {
    return new Promise((resolve, reject) => {
      initListeners();
      checkQueryString();

      function getUserUUID() {
        function setUserUUID(result) {
          context.uuuid = result && result.value;
        }
        db.findSetting('userUUID').then(setUserUUID);
      }

      function DBready() {
        coms.init();
        getUserUUID();

        if (checkFirstTime()) courtHiveChallenge();
        tmxStore.dispatch({ type: 'db loaded', payload: true });
        showSplash();
        resolve();
      }

      try {
        initDB().then(DBready, reject);
      } catch (err) {
        reject(err);
      }
    });
  };

  fx.addMessage = (msg) => {
    const msgHash = (m) =>
      Object.keys(m)
        .map((key) => m[key])
        .join('');
    const messageHash = msgHash(msg);
    const exists = env.messages.reduce((p, c) => (msgHash(c) === messageHash ? true : p), false);
    if (!exists) env.messages.push(msg);
  };

  fx.authMessage = (msg) => {
    function pushMessage(tournament) {
      receiveAuth(tournament);

      if (msg.referee_key) {
        context.ee.emit('sendKey', msg.referee_key);
      }
      if (msg.tournament_key) {
        addTournamentKey(msg.tournament_key, msg.tournamentId);
      }

      function noTournament() {
        msg.notice = 'Not Found in Calendar';
        env.messages.push(msg);
      }

      function displayTournament() {
        editTournament({ tournamentId: msg.tournamentId });
      }

      function tournamentExists(tournament) {
        msg.inDB = true;
        msg.notice = `${tournament.name}`;

        const message = `${i18n.t(msg.title)}: ${msg.notice}`;
        const action = contentEquals('tournament')
          ? ''
          : { text: i18n.t('tournaments.edit'), onClick: displayTournament };
        AppToaster.show({ icon: 'tick', intent: 'success', message, action });
      }
      function keepExisting() {
        tournamentExists(tournament);
      }
      function addReceivedTournament(receivedTournament) {
        const tournament = JSON.parse(receivedTournament);
        db.addTournament(tournament).then(() => tournamentExists(tournament), noTournament);
      }
      function keepReceived() {
        addReceivedTournament(msg.tournament);
      }

      if (tournament && msg.tournament && msg.send_auth) {
        const actions = [
          { action: 'keepReceived', fx: keepReceived, label: i18n.t('tournaments.received') },
          { action: 'keepExisting', fx: keepExisting, label: i18n.t('tournaments.existing') }
        ];

        const header = `<b>${i18n.t('save')}&nbsp;${i18n.t('trn')}</b>`;
        if (isDev()) console.log('auth message', { header, actions });
      } else if (!tournament && msg.tournament) {
        if (isDev()) console.log({ msg });
        addReceivedTournament(msg.tournament);
      } else if (tournament) {
        tournamentExists(tournament);
      } else {
        noTournament();
      }
    }

    db.findTournament(msg.tournamentId).then(pushMessage, (err) => console.log(err));
  };

  return fx;
})();
