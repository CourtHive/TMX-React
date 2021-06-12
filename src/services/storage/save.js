import { db } from './db';
import { env } from 'config/defaults';

export const save = (function () {
  const fx = {};
  let timeoutId = null;

  fx.local = ({ tournament } = {}) => {
    if (!tournament) {
      console.log('no tournament');
      return;
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

  return fx;
})();
