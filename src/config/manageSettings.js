import { env } from 'config/defaults';
import { db } from 'services/storage/db';
import { coms } from 'services/communications/SocketIo/coms';
import { context } from 'services/context';
import { contentEquals } from 'services/screenSlaver';
import { tmxStore } from 'stores/tmxStore';
import { boolAttrs, keyWalk } from 'functions/objects';

import { utilities } from 'tods-competition-factory';

function resetOptions() {
  const original_env = {
    teams: { display: true, merge: { replace: false } },
    calendar: { start: undefined, end: undefined, category: undefined, first_day: 0 },
    publishing: {
      broadcast: true,
      livescore: false,
      require_confirmation: false,
      publish_on_score_entry: true,
      publish_draw_creation: false
    },
    printing: {
      pageSize: 'A4',
      save_pdfs: false,
      schedule: { header: true, footer: true },
      drawsheets: { header: true, footer: true }
    },
    draws: {
      doubles: { adhoc: false },
      autodraw: true,
      dual: { elimination: true, roundrobin: true },
      types: {
        elimination: true,
        qualification: true,
        roundrobin: true,
        consolation: true,
        compass: true,
        playoff: true,
        adhoc: true
      },
      subtypes: { qualification: { preround: true, incidentals: false } },
      structures: { feedin: { elimination: true, consolation: true }, backdraw: true },
      compass_draw: { direction_by_loss: false },
      adhoc: { minimums: { singles: 2, doubles: 2 }, elo: false }
    }
  };

  keyWalk(original_env, env);
}

function initiateUpdate(data) {
  updateSettings(data.content).then(
    () => envSettings().then(settingsReceived, (err) => console.log({ err })),
    (err) => console.log({ err })
  );
  function settingsReceived() {
    settingsLoaded();
    setIdiom();
    checkRefresh();
  }
  function setIdiom() {
    db.findSetting('defaultIdiom').then(checkIdiom, (err) => console.log({ err }));
  }
  function checkIdiom(idiom) {
    context.ee.emit('changeIdiom', { ioc: idiom && idiom.ioc });
    if (contentEquals('splash')) {
      context.ee.emit('showSplash', { source: 'after settings update' });
    }
  }
  function checkRefresh() {
    const payload = { orgAbbr: env.org.abbr };
    tmxStore.dispatch({ type: 'key loaded', payload });
  }
}

function updateSettings(settings) {
  return new Promise((resolve, reject) => {
    if (!settings) resolve();
    Promise.all(settings.map((s) => db.addSetting(s))).then(resolve, reject);
  });
}

export function envSettings() {
  return new Promise((resolve, reject) => {
    db.findAllSettings().then(setEnv, reject);

    function setEnv(settings) {
      const fetchRegistered = getKey('fetchRegisteredPlayers');
      const registeredMethod = fetchRegistered && (fetchRegistered.url || fetchRegistered.request) ? true : false;
      context.settings.fetchRegisteredPlayers = registeredMethod;

      const misc = getKey('envSettings');
      if (misc && misc.settings) {
        boolAttrs(misc.settings);
        keyWalk(misc.settings, env);
      }

      const org = getKey('orgData');
      if (org) {
        Object.keys(env.org).forEach((key) => {
          try {
            if (org[key]) {
              env.org[key] = org[key];
            }
          } catch (err) {
            console.log('%c Error assigning key', { org, key });
          }
        });
      }

      const superUser = getKey('superUser');
      if (superUser) context.state.admin = superUser.auth;

      const cal = getKey('calendarSettings');
      if (cal && cal.settings) {
        boolAttrs(cal.settings);
        keyWalk(cal.settings, env.calendar);
      }

      const draws = getKey('drawSettings');
      if (draws && draws.settings) {
        boolAttrs(draws.settings);
        keyWalk(draws.settings, env.draws);
      }

      const printing = getKey('printingSettings');
      if (printing && printing.settings) {
        boolAttrs(printing.settings);
        keyWalk(printing.settings, env.printing);
      }

      const docs = getKey('docSettings');
      if (docs && docs.settings) {
        boolAttrs(docs.settings);
        keyWalk(docs.settings, env.documentation);
      }

      const schedule = getKey('scheduleSettings');
      if (schedule && schedule.settings) {
        boolAttrs(schedule.settings);
        keyWalk(schedule.settings, env.schedule);
      }

      const custom = getKey('customSettings');
      if (custom && custom.settings) {
        boolAttrs(custom.settings);
        keyWalk(custom.settings, env);
      }

      const devset = getKey('devSettings');
      if (devset && devset.settings) {
        boolAttrs(devset.settings);
        keyWalk(devset.settings, env);
      }

      // in general addSetting uses the .settings attribute... but this
      // is a legacy situation where .value was used to store uuuids...
      const uuuid = getKey('userUUID');
      if (!uuuid || !uuuid.value) {
        env.firstTimeUser = true;
        env.uuuid = utilities.UUID();
        db.addSetting({ key: 'userUUID', value: env.uuuid, settings: env.uuuid });
        coms.emitTmx({ action: 'newClient', notice: 'New TMX Client' });
      } else {
        env.uuuid = uuuid.value;
      }

      settingsLoaded();

      resolve();

      // function externalRequests() { return settings.filter(s => s.category && s.category == 'externalRequest'); }
      function getKey(key) {
        return settings.reduce((p, c) => (c.key === key ? c : p), undefined);
      }
    }
  });
}

function settingsLoaded() {
  context.ee.emit('settingsLoaded');
}

export function receiveOrgSettings(data) {
  const settings_to_remove = [
    'orgLogo',
    'orgName',
    'orgData',
    'pushTODS',
    'superUser',
    'fetchClubs',
    'devSettings',
    'envSettings',
    'docSettings',
    'pointsTable',
    'settingsTabs',
    'drawSettings',
    'appComponents',
    'fetchRankList',
    'customSettings',
    'searchSettings',
    'fetchNewPlayers',
    'fetchPlayerDatea',
    'calendarSettings',
    'printingSettings',
    'scheduleSettings',
    'scoreboardDefaults',
    'publishingSettings',
    'fetchNewTournaments',
    'fetchRegisteredPlayers'
  ];
  Promise.all(settings_to_remove.map((s) => db.deleteSetting(s))).then(receive, receive);

  resetOptions();
  Object.keys(env.exports).forEach((key) => (env.exports[key] = false));

  env.documentation.localhelp = false;
  if (env.documentation.helptext) {
    Object.keys(env.documentation.helptext).forEach((key) => (env.documentation.helptext[key] = undefined));
  }

  function receive() {
    receiveSettings(data);
  }
}

export function receiveSettings(data) {
  db.findSetting('keys').then(updateKey, updateKey);
  function updateKey(setting = { key: 'keys', keys: [] }) {
    setting.keys = setting.keys.filter((k) => k.keyid !== data.keyid);
    if (data.keyid && data.description) {
      setting.keys.push({ keyid: data.keyid, description: data.description });
      db.addSetting(setting).then(
        () => initiateUpdate(data),
        () => initiateUpdate(data)
      );
    } else if (!Array.isArray(data.content)) {
      boolAttrs(data.content);
      keyWalk(data.content, env);
    }
  }
}
