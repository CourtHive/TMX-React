import { db } from './db';
import { context } from '../context';
import { env } from 'config/defaults';
import { isLocalhost } from 'functions/isLocalhost';
import { coms } from 'services/communications/SocketIo/coms';

import { getTournamentRecord } from 'stores/accessor';

export const save = (function () {
  const fx = {};
  let timeoutId = null;

  fx.local = ({ tournament } = {}) => {
    if (!tournament) {
      console.log('no tournament');
      return;
    }
    const PUSH_PERIOD = env.server.push.period || 200000;
    const timeNow = new Date().getTime();
    // check timestamp for last push to cloud and if > PUSH_PERIOD the auto-save to cloud
    const lastCloudSave = context.state.lastCloudSave;
    const attemptDiff = timeNow - (context.state.lastCloudSaveAttempt || timeNow);
    const avoidBurst = !attemptDiff || attemptDiff > 300;
    const diff = new Date().getTime() - (lastCloudSave || 0);
    if (tournament && avoidBurst && diff > PUSH_PERIOD) {
      context.state.lastCloudSaveAttempt = new Date().getTime();
      if (isLocalhost) {
        console.log('%c pushed to server', 'color: lightgreen');
      }
      fx.cloud({ tournament });
    }

    const cantsave = document.querySelector('.NOSAVE');
    if (cantsave) {
      console.log('cannot save');
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => syncSave(tournament), 500);
    }
  };

  function syncSave(tournament) {
    if (tournament) {
      db.addTournament(tournament);
      if (env.exports?.localStorage) {
        localStorage.removeItem('saveTournament');
        localStorage.setItem('tournamentRecord', JSON.stringify(tournament));
      }
    }
  }

  fx.cloud = ({ tournament, callback } = {}) => {
    if (!tournament) {
      tournament = getTournamentRecord();
    }
    if (!tournament) return;

    function tournamentPushed() {
      context.state.lastCloudSave = new Date().getTime();
      if (callback && typeof callback === 'function') callback();
    }

    coms.emitTmx({ action: 'pushTournament', payload: { tournament } }, tournamentPushed);
  };

  return fx;
})();
