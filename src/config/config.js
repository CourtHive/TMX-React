import { env } from 'config/defaults';
import { isDev } from 'functions/isDev';
import { db } from 'services/storage/db';
import { context } from 'services/context';
import { envSettings } from 'config/manageSettings';
import { courtHiveChallenge } from 'functions/tournament/courtHiveChallenge';

import { showSplash } from 'services/screenSlaver';
import { tmxStore } from 'stores/tmxStore';

export const config = (function () {
  const fx = {};

  function dbUpgrade() {
    console.log('db upgrade close browser and re-open');
  }

  const catchAsync = (fn) => (...args) => {
    if (isDev()) {
      return fn(...args);
    } else {
      return fn(...args).catch((err) => fx.logError(err));
    }
  };
  function initDB() {
    return new Promise((resolve, reject) => {
      catchAsync(db.initDB)().then(envSettings, dbUpgrade).then(resolve, reject);
    });
  }

  function checkFirstTime() {
    if (env.firstTimeUser) {
      env.firstTimeUser = false;
      return true;
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
    context.ee.addListener('settingsLoaded', settingsLoaded);
    context.ee.addListener('receiveTournamentRecord', (data) => console.log('receiveTournamentRecord', data));
  }

  fx.init = () => {
    return new Promise((resolve, reject) => {
      initListeners();

      function getUserUUID() {
        function setUserUUID(result) {
          context.uuuid = result && result.value;
        }
        db.findSetting('userUUID').then(setUserUUID);
      }

      function DBready() {
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

  return fx;
})();
