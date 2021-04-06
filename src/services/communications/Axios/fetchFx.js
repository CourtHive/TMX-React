import i18n from 'i18next';
import { db } from 'services/storage/db';
import { createFx } from 'functions/objects';

import { invalidURLorNotShared } from 'services/notifications/invalid';
import { AppToaster } from 'services/notifications/toaster';

import { fetchGoogleSheet } from 'services/communications/Axios/fetch/fetchGoogleSheet';

import { tmxStore } from 'stores/tmxStore';
import { boolAttrs } from 'functions/objects';
import { getWindow, getNavigator } from 'functions/browser';

import { fixtures } from 'tods-competition-factory';
const { countries } = fixtures;

export const fetchFx = (function () {
  const fx = {};

  fx.fetchNewTournaments = fetchNewTournaments;
  function fetchNewTournaments() {
    return new Promise((resolve, reject) => {
      db.findSetting('fetchNewTournaments').then(checkSettings, reject);

      function checkSettings(fetchobj) {
        if (!fetchobj) {
          return reject({ error: i18n.t('phrases.notconfigured') });
        }
        if (fetchobj.category === 'fido') {
          console.log('attempt to fetch', { fetchobj });
          return;
        }

        tmxStore.dispatch({ type: 'loading state', payload: true });

        fetchobj.url = checkURL(fetchobj.url);
        boolAttrs(fetchobj);
        db.findAllTournaments().then((trnys) => fetchNew(trnys, fetchobj));
      }

      /*
      function done(result) {
        tmxStore.dispatch({ type: 'loading state', payload: false });
        resolve(result);
      }
      */

      function fetchNew() {
        /*
        // for tournaments to be updated automatically they must have an .sid attribute equal to env.org.abbr
        let tids = trnys.filter((t) => t.sid && t.sid === env.org.abbr).map((t) => t.tournamentId.replace(t.sid, ''));
        let max_id = fetchobj.max_id !== false ? (!merge && Math.max(...tids, 0)) || 0 : '';

        let request_object = {
          [fetchobj.type]: fetchobj.url + max_id,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
        let request = JSON.stringify(request_object);
        function responseHandler(result) {
          if (result.json) {
            normalizeTournaments(result.json, fetchobj);
          } else {
            tmxStore.dispatch({ type: 'loading state', payload: false });
            return reject(result.err || 'Error');
          }
        }
        */
        // ajax('/api/match/request', request, 'POST', responseHandler);
      }

      /*
      function normalizeTournaments(trnys, fetchobj) {
        let parser = fetchobj.parser && fetchobj.parser.fx && createFx(fetchobj.parser.fx);
        let ouid = env.org && env.org.ouid;
        if (Array.isArray(trnys)) {
          let tt = trnys.map((t) => {
            let trny = Object.assign({}, t);
            if (parser) {
              let pt = parser(t);
              Object.assign(trny, pt);
            }
            trny.start = validDate(trny.start) ? new Date(trny.start).getTime() : trny.start;
            trny.end = validDate(trny.end) ? new Date(trny.end).getTime() : trny.start || trny.end;
            if (!trny.ouid) trny.ouid = ouid;

            // TODO: This needs to be a configured SID (Site ID?) and not env.org (HTS)
            trny.tournamentId = `${env.org.abbr}${t.tournamentId || t.id}`;
            return trny;
          });
          done(tt);
        } else {
          done([]);
        }
      }
      */
    });
  }

  function extractSheetID(url) {
    const parts = url.split('/');
    if (parts.indexOf('docs.google.com') < 0 || parts.indexOf('spreadsheets') < 0) return undefined;
    return parts.reduce((p, c) => (!p || c.length > p.length ? c : p), undefined);
  }

  fx.fetchNewPlayers = fetchNewPlayers;
  function fetchNewPlayers() {
    return new Promise((resolve, reject) => {
      tmxStore.dispatch({ type: 'loading state', payload: true });
      const done = () => {
        tmxStore.dispatch({ type: 'loading state', payload: false });
      };
      db.findAllSettings().then(checkSettings, reject);

      function checkSettings(settings = []) {
        const fetch_new_players = settings.reduce((p, c) => (c.key === 'fetchNewPlayers' ? c : p), undefined);
        const sync_players = settings.reduce((p, c) => (c.key === 'syncPlayers' ? c : p), undefined);

        if (fetch_new_players && fetch_new_players.url) {
          fetch_new_players.url = checkURL(fetch_new_players.url);
          db.findAllPlayers().then((plyrz) => fetchNew(plyrz, fetch_new_players));
        } else if (sync_players && sync_players.url) {
          sync_players.url = checkURL(sync_players.url);
          const sheet_id = extractSheetID(sync_players.url);
          if (sheet_id) {
            fetchGoogleSheet(sheet_id).then(finish, fail);
          } else {
            return reject({ error: i18n.t('phrases.invalidsheeturl') });
          }
        } else {
          return reject({ error: i18n.t('phrases.notconfigured') });
        }
      }

      function fail() {
        done();
        invalidURLorNotShared();
      }

      function finish(result) {
        done();
        const players = (result && result.players) || [];
        return resolve(players);
      }

      function fetchNew() {
        /*
        // maximum player records determined by numeric ids; others excluded
        let max_id = Math.max(0, ...plyrz.map((p) => (!isNaN(+p.id) ? +p.id : 0)));
        let increment_url = fetchobj.increment === 'false' ? false : true;
        let request_url = fetchobj.url;
        if (increment_url) request_url += max_id;
        let request_object = {
          [fetchobj.type]: request_url,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
        let request = JSON.stringify(request_object);
        function responseHandler(result) {
          done();
          if (result.json) {
            let players = result.json.filter((p) => p.first_name && p.last_name);
            normalizePlayers(players, fetchobj);

            if (max_id) updatePlayerDates();
            return resolve(players);
          } else {
            return reject(result.err || 'Error');
          }
        }
        */
        // ajax('/api/match/request', request, 'POST', responseHandler);
      }

      // TODO: ID generation should occur on the remote server, not in this script!
      // nameHash should be elminated...
      /*
      function normalizePlayers(players) {
        players.forEach((player) => {
          let rtp_date = new Date(player.right_to_play_until);
          player.right_to_play_until = rtp_date !== 'Invalid Date' ? rtp_date.getTime() : undefined;
          let ru_date = new Date(player.registered_until);
          player.registered_until = ru_date !== 'Invalid Date' ? ru_date.getTime() : undefined;
          let birth_date = new Date(player.birth);
          player.birth = birth_date !== 'Invalid Date' ? birth_date.getTime() : undefined;
          let foreign = player.foreign !== 'N';
          player.ioc = player.ioc || (!player.ioc && !foreign ? 'CRO' : undefined);
          // player.represents_ioc = player.represents_ioc !== 'N';
          player.residence_permit = player.residence_permit !== 'N';
          player.last_name = normalizeName(player.last_name, false).trim();
          player.first_name = normalizeName(player.first_name, false).trim();
          player.id = player.id || `${player.foreign === 'Y' ? 'INO' : 'CRO'}-${player.cropin}`;
        });

        resolve(players);
      }
      */
    });

    /*
    function updatePlayerDates() {
      console.log('updating player dates');
      fetchPlayerDates().then(processDates, (err) => console.log(err));

      function processDates(update_object) {
        db.db.players.toCollection().modify((player) => {
          if (update_object[player.id]) {
            player.right_to_play_until = new Date(update_object[player.id].rtp).getTime();
            player.registered_until = new Date(update_object[player.id].r).getTime();
          }
        });
      }
    }
    */
  }

  /*
  fx.fetchRankLists = fetchRankLists;
  function fetchRankLists(categories) {
    return new Promise((resolve, reject) => {
      Promise.all(categories.map((category) => fetchRankList({ category }))).then(rankObj, rankErr);

      function rankErr() {
        const message = `Cannot Fetch Rank Lists`;
        if (fx.errors) AppToaster.show({ icon: 'error', intent: 'error', message });
        reject();
      }

      function rankObj(rankings) {
        const failures = rankings.filter((f) => !f.valid);
        if (failures.length) notify(failures);
        const obj = Object.assign(
          {},
          ...rankings
            .filter((f) => f.valid)
            .map((r) => {
              return { [r.rankings.category]: r };
            })
        );
        resolve(obj);
      }
    });
  }

  function notify(failures) {
    const nav = getNavigator();
    if (nav && nav.onLine) console.log('failure to update rank lists', failures);
    return;
  }
  */

  function fetchedToday(date_in_question) {
    const today = new Date();
    const qdate = new Date(date_in_question);
    if (!date_in_question) return false;
    return (
      today.getMonth() === qdate.getMonth() &&
      today.getFullYear() === qdate.getFullYear() &&
      today.getDate() === qdate.getDate()
    );
  }

  fx.fetchRankList = fetchRankList;
  function fetchRankList({ category, force }) {
    return new Promise((resolve, reject) => {
      db.findRankings(category).then(checkRankings, (err) => reject({ error: err }));

      function checkRankings(rankings) {
        const rankings_date = rankings ? new Date(rankings.date) : undefined;
        let fetched_today = fetchedToday(rankings_date);
        if (window.dev || force) fetched_today = false;
        if (!rankings || !fetched_today) {
          const nav = getNavigator();
          if (nav && nav.onLine) {
            db.findSetting('fetchRankList').then(checkSettings, reject);
          } else {
            // if (verification) xxx.inform({ message: i18n.t('phrases.verifyranking') });
            resolve({ listname: category, valid: false, rankings });
          }
        } else {
          resolve({ valid: true, rankings });
        }
      }

      function checkSettings(fetchobj) {
        if (!fetchobj || !fetchobj.url) return reject({ error: i18n.t('phrases.notconfigured') });
        fetchobj.url = checkURL(fetchobj.url);
        fetchList(fetchobj);
      }

      function fetchList() {
        /*
        let request_object = {
          [fetchobj.type]: fetchobj.url + category,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
        let request = JSON.stringify(request_object);
        function responseHandler(data) {
          if (data && data.json && Array.isArray(data.json)) {
            let player_rankings = Object.assign(
              {},
              ...data.json.map((r) => {
                return { [r.id]: r };
              })
            );
            let rankings = { category, players: player_rankings, date: new Date().getTime() };
            db.addCategoryRankings(rankings).then(
              () => resolve({ valid: true, rankings }),
              (err) => reject({ error: err })
            );
          } else if (data && data.json && data.json.players && typeof data.json.players === 'object') {
            let rankings = { category, players: data.json.players, date: new Date().getTime() };
            db.addCategoryRankings(rankings).then(
              () => resolve({ valid: true, rankings }),
              (err) => reject({ error: err })
            );
          } else {
            return reject({ error: 'Error' });
          }
        }
        */
        // ajax('/api/match/request', request, 'POST', responseHandler);
      }
    });
  }

  fx.fetchRegisteredPlayers = fetchRegisteredPlayers;
  function fetchRegisteredPlayers({ tournamentId, category, show_notice = true }) {
    return new Promise((resolve, reject) => {
      if (!tournamentId) return reject('No Tournament ID');

      db.findSetting('fetchRegisteredPlayers').then(checkSettings, failed);

      function failed(result) {
        tmxStore.dispatch({ type: 'loading state', payload: false });
        return reject(result);
      }

      function checkSettings(fetchobj) {
        if (!fetchobj) {
          return reject({ error: i18n.t('phrases.notconfigured') });
        }
        if (fetchobj.category === 'fido') {
          return console.log('attempt to fetch', { tournamentId, category, fetchobj });
        }

        if (show_notice) {
          console.log('notice');
        }

        let uuid = tournamentId;
        const preprocessor = fetchobj.preprocessor && fetchobj.preprocessor.fx && createFx(fetchobj.preprocessor.fx);
        if (fetchobj.scrapers) {
          return selectScraper(fetchobj);
        } else if (fetchobj.parameter && fetchobj.parameter === 'key') {
          // legacy re-fetch of updated players from R2
          /*
          let tournamentKey = sendFx.state().tournament_key;
          if (!tournamentKey || !fetchobj.url) {
            return;
          } else {
            let url = `${fetchobj.url}${tournamentKey}`;
            console.log('Local key is required to fetch players', { tournamentKey });
            return fetchTournamentPlayers(url);
          }
          */
        } else if (preprocessor) {
          uuid = preprocessor(uuid);
        } else if (tournamentId.indexOf('HTS') === 0) {
          console.log('remove reference to HTS when preprocessor present in HTS Keys');
          uuid = tournamentId.slice(3);
        }

        fetchobj.url = checkURL(fetchobj.url);
        remoteRequest(fetchobj, uuid);
      }

      function selectScraper(fetchobj) {
        const keys = Object.keys(fetchobj.scrapers);
        if (keys.length > 1) {
          const message = `<h3 class='title is-4'>${i18n.t('phrases.playerimport')}</h3>`;
          console.log({ message });
        } else {
          goScrape(keys[0]);
        }
        function goScrape(key) {
          const scraper = fetchobj.scrapers[key];
          scrape(scraper);
        }
      }

      function scrape() {
        const iocCodes = countries.filter((c) => c.ioc);
        const ioc_map = Object.assign({}, ...iocCodes.map((c) => ({ [c.label.toUpperCase()]: c.ioc })));
        ioc_map['USA'] = ioc_map['UNITED STATES'];
        ioc_map['UNITED KINGDOM'] = ioc_map['GREAT BRITAIN'];

        tmxStore.dispatch({ type: 'loading state', payload: true });
        /*
        fetchHTML(scraper.url).then(
          (doc) => {
            tmxStore.dispatch({ type: 'loading state', payload: false });
            let players = (parser && parser(doc)) || [];
            players.forEach((player) => {
              player.full_name = `${player.last_name.toUpperCase()}, ${normalizeName(
                player.first_name,
                false
              )}`;
              if (!player.id) player.id = hashId(player.full_name) || `pl${utilities.UUID()}`;
              if (!player.ioc && player.country) player.ioc = ioc_map[player.country.toUpperCase()];
            });
            tmxStore.dispatch({ type: 'loading state', payload: false });
            return done({ players });
          },
          (err) => console.log('err:', err)
        );
        */
      }

      function remoteRequest() {
        /*
        let request_object = {
          [fetchobj.type]: fetchobj.url + uuid,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
        let request = JSON.stringify(request_object);

        function responseHandler(result) {
          if (result.json) {
            processJSON(result.json);
          } else {
            let data = result.result && result.result.data;
            if (data && data.toLowerCase().indexOf('server') >= 0) {
             console.log('Server Error')
              return;
            }
            notConfigured();
          }
          function processJSON(json) {
            if (!json) return;
            let players = json.filter((p) => p.last_name);

            players.forEach((player) => {
              player.first_name = player.first_name.trim();
              player.last_name = player.last_name.trim();
              player.full_name = `${player.last_name.toUpperCase()}, ${normalizeName(
                player.first_name,
                false
              )}`;

              if (category) {
                // player.rankings, if present, are used before player.rank
                if (!player.rankings) player.rankings = {};
                player.rankings[category] = +player.rank || undefined;
              }

              player.rank = +player.rank || undefined;
            });
            Promise.all(
              players.map((player) => {
                if (player.id) {
                  return db.findPlayerById(player.id);
                } else {
                  console.log('did not find player by id');
                  return {};
                }
              })
            ).then((dbplayers) => updateLocal(dbplayers, players), reject);
          }
        }
        */
        // ajax('/api/match/request', request, 'POST', responseHandler);
      }

      /*
      function updateLocal(dbplayers, players) {
        // update players with info from database
        // TODO: this should not be necessary in the future... remote server should *always* give proper ID
        players.forEach((player, i) => {
          if (dbplayers[i]) {
            player.id = player.id || dbplayers[i].id;
            player.ioc = player.ioc || dbplayers[i].ioc;
            if (!player.ioc && player.country && player.country.length === 3) player.ioc = player.country;
          } else {
            if (player.country && player.country.length === 3) player.ioc = player.country;
            if (!player.id) player.id = `${player.id}${player.country || ''}${player.birth}`;
          }
        });
        return done({ players });
      }
      */
    });
  }

  fx.fileNotRecognized = () => {
    const message = `File Not Recognized`;
    AppToaster.show({ icon: 'error', intent: 'error', message });
  };

  function checkURL(url) {
    return url && url.indexOf('http') === 0 ? url : `${getWindow().location.origin}/${url}`;
  }

  return fx;
})();
