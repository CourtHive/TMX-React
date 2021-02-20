import i18n from 'i18next';
import { env } from 'config/defaults';
import { db } from 'services/storage/db';
import { performTask } from 'functions/tasks';
import { AppToaster } from 'services/notifications/toaster';

import { tmxStore } from 'stores/tmxStore';

export function loadJSON({ json, valid, callback }) {
  if (!Object.keys(json).length && !json.length) return;

  const loadType = {
    tournaments() {
      loadTournaments(json, callback);
    }
  };

  const identifiedJSONdata = identifyJSON(json);
  if (!identifiedJSONdata || (valid && valid.indexOf(identifiedJSONdata) < 0)) {
    AppToaster.show({ icon: 'error', intent: 'warning', message: i18n.t('phrases.badfile') });
  } else {
    loadType[identifiedJSONdata](callback);
  }
}

function identifyJSON(json) {
  const keys = Object.keys(Array.isArray(json) ? json[0] : json).map((k) => k && k.toLowerCase());
  if (!keys.length) return;

  if (['startdate', 'enddate', 'tournamentid'].filter((k) => keys.indexOf(k) >= 0).length === 3) return 'tournaments';
}

function loadTournaments(json, callback) {
  let importJSON;
  if (env.exports?.localStorage) {
    localStorage.removeItem('saveTournament');
    localStorage.setItem('tournamentRecord', JSON.stringify(importJSON));
  }
  loadTask(db.addTournament, importJSON, callback);
}

function loadTask(fx, arr, callback) {
  tmxStore.dispatch({ type: 'loading state', payload: true });

  performTask(fx, Array.isArray(arr) ? arr : [arr], false).then(finish, finish);

  function finish() {
    tmxStore.dispatch({ type: 'loading state', payload: false });
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
}
