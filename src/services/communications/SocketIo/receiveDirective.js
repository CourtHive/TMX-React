import i18n from 'i18next';
import { db } from 'services/storage/db';
import { context } from 'services/context';
import { resetDB } from 'services/storage/resetDB';
import { loadJSON } from 'services/files/importing/loadJSON';
import { receiveOrgSettings, receiveSettings } from '../../../config/manageSettings';

import { AppToaster } from 'services/notifications/toaster';
import { IDIOM_STORAGE } from 'constants/localStorage';

export function receiveTournaments({ tournaments }) {
  const newTournaments = tournaments?.map((t) => JSON.parse({ data: t })).filter((f) => f);
  if (newTournaments) Promise.all(newTournaments.map(mergeTournament)).catch((err) => console.log(err));

  function mergeTournament(trny) {
    return new Promise((resolve, reject) => {
      const tournamentId = trny.unifiedTournamentId?.tournamentId || trny.tournamentId;
      db.findTournament(tournamentId).then(mergeExisting, (err) => console.log(err));
      function mergeExisting(existing) {
        if (!existing) {
          context.ee.emit('updateTournament', trny);
          db.addTournament(trny).then(resolve, reject);
        } else {
          resolve();
        }
      }
    });
  }
}

export function processDirective(data) {
  const jsonData = JSON.parse(data);

  if (jsonData && jsonData.directive) {
    if (context.isLocalhost) console.log(`%c received tmx directive: ${jsonData.directive}`, 'color: green');
    if (jsonData.directive === 'settings') {
      if (jsonData.keyType === 'orgSetting') {
        receiveOrgSettings(jsonData);
      } else {
        receiveSettings(jsonData);
      }
      AppToaster.show({ icon: 'tick', intent: 'success', message: jsonData.description });
    }
    if (jsonData.subKey) {
      context.ee.emit('sendKey', jsonData.subKey);
    }
    if (jsonData.directive === 'new version') {
      const msg = jsonData.notice || '';
      context.ee.emit('addMessage', { title: 'newversion', notice: msg, state: 'update' });
      AppToaster.show({ icon: 'clean', intent: 'primary', message: i18n.t('newversion') });
    }
    if (jsonData.directive === 'team data') {
      console.log('team data received;', jsonData);
    }
    if (jsonData.directive === 'load data' && jsonData.content) {
      loadJSON(jsonData.content);
    }
    if (jsonData.directive === 'reset db' && jsonData.content) {
      resetDB();
    }
    if (jsonData.directive === 'clear settings' && jsonData.content) {
      db.db.settings.toCollection().delete();
    }
    if (jsonData.directive === 'add idiom' && jsonData.content) {
      const { ioc: lng, idiom: translation } = jsonData.content;
      const idiomToStore = JSON.stringify({ [lng]: { translation } });
      localStorage.setItem(IDIOM_STORAGE, idiomToStore);
      i18n.changeLanguage(lng);
    }
  }
}
