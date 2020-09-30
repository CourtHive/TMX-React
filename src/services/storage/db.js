import Dexie from 'dexie';

export const db = (function () {
  const db = {};

  db.initDB = () => {
    try {
      return new Promise((resolve) => {
        db.db = new Dexie('TMX', { autoOpen: true });
        db.db.version(1).stores({
          tournaments: '&tournamentId, name, startDate, endDate',
          settings: 'key',
          idioms: 'ioc'
        });
        resolve();
      });
    } catch (err) {
      return new Promise((_, reject) => {
        reject(err);
      });
    }
  };

  db.resetDB = (callback) => {
    db.db.close();
    Dexie.delete('TMX').then(callback, () => alert('Failed to Reset Database'));
  };

  db.findAll = (table) => {
    return new Promise((resolve, reject) => {
      const targetTable = db.db[table];
      if (targetTable) {
        return targetTable.toArray(resolve, reject).catch(reject);
      } else {
        return resolve([]);
      }
    });
  };
  db.findAllTournaments = () => db.findAll('tournaments');
  db.findAllSettings = () => db.findAll('settings');
  db.findAllIdioms = () => db.findAll('idioms');

  db.findWhere = (tbl, attr, val) =>
    new Promise((resolve, reject) => db.db[tbl].where(attr).equals(val).toArray(resolve, reject).catch(reject));

  db.deleteTournament = (tournamentId) => {
    return new Promise((resolve, reject) => {
      db.db.tournaments.where('tournamentId').equals(tournamentId).delete().then(resolve, reject);
    });
  };
  db.deleteSetting = (key) => db.db.settings.where('key').equals(key).delete();

  // dangerous!
  db.deleteAllTournamentAttr = (attr) =>
    db.db.tournaments
      .toCollection()
      .modify((tournament) => delete tournament[attr])
      .then(() => console.log('done'));

  db.findUnique = (tbl, attr, val) =>
    new Promise((resolve, reject) =>
      db.findWhere(tbl, attr, val).then((d) => resolve(d && d.length ? d[0] : undefined), reject)
    );
  db.findSetting = (key) => db.findUnique('settings', 'key', key);
  db.findIdiom = (ioc) => db.findUnique('idioms', 'ioc', ioc);
  db.findTournament = (tournamentId) => db.findUnique('tournaments', 'tournamentId', tournamentId);
  db.addItem = (tbl, item) =>
    new Promise((resolve, reject) =>
      db.db[tbl]
        .put(item)
        .then(resolve, reject)
        .catch((err) => {
          alert('try again:', err);
          reject(err);
        })
    );

  db.modifyOrAddUnique = (tbl, attr, val, item) =>
    new Promise((resolve, reject) => {
      db.db[tbl]
        .where(attr)
        .equals(val)
        .modify((data) => Object.assign(data, item))
        .then(
          (result) => {
            if (result) {
              return resolve('exists');
            } else {
              db.addItem(tbl, item).then(resolve, reject);
            }
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });

  db.addIdiom = (idiom) => db.modifyOrAddUnique('idioms', 'ioc', idiom.ioc, idiom);
  db.addTournament = (tournament) => {
    const tournamentId = tournament.unifiedTournamentId?.tournamentId || tournament.tournamentId;
    return db.modifyOrAddUnique('tournaments', 'tournamentId', tournamentId, tournament);
  };
  db.addSetting = (setting) => db.replaceOrAddUnique('settings', 'key', setting.key, setting);

  db.replaceOrAddUnique = (tbl, attr, val, item) =>
    new Promise((resolve, reject) => {
      db.db[tbl]
        .where(attr)
        .equals(val)
        .delete()
        .then(
          () => {
            db.addItem(tbl, item).then(resolve, reject);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });

  db.modify = (tbl, attr, val, fx, params) =>
    new Promise((resolve, reject) => {
      db.db[tbl]
        .where(attr)
        .equals(val)
        .modify((item) => {
          Object.assign(params, { item });
          fx(params);
        })
        .then(resolve, (err) => {
          console.log('error:', err);
          reject();
        });
    });

  return db;
})();
