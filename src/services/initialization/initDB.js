import { courtHiveChallenge } from 'functions/tournament/courtHiveChallenge';
import { catchAsync } from 'services/errors/catchAsync';
import { utilities } from 'tods-competition-factory';
import { tmxStore } from 'stores/tmxStore';
import { context } from 'services/context';
import { db } from 'services/storage/db';

function getUserUUID() {
  function setUserUUID(result) {
    if (result) {
      context.uuuid = result && result.value;
    } else {
      const uuuid = utilities.UUID();
      context.uuuid = uuuid;
      courtHiveChallenge();
      const setting = { key: 'userUUID', uuuid };
      db.addSetting(setting);
    }
  }
  db.findSetting('userUUID').then(setUserUUID);
}

export function initDB() {
  return new Promise((resolve, reject) => {
    const dbLoaded = tmxStore.getState().tmx.dbLoaded;
    if (dbLoaded) return resolve();
    const afterInit = () => {
      getUserUUID();
      setTimeout(() => {
        tmxStore.dispatch({ type: 'db loaded', payload: true });
      }, 1000);
      return resolve();
    };
    catchAsync(db.initDB)().then(afterInit, reject);
  });
}
