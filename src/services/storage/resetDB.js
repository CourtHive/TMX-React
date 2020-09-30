import { db } from './db';
import { tmxStore } from 'stores/tmxStore';

export function resetDB() {
  let reload = () => { window.location.replace(window.location.pathname); };
  let okAction = () => { db.resetDB(reload); };
  tmxStore.dispatch({
     type: 'alert dialog',
     payload: {
        title: 'Database Initialization Failed',
        content: 'Version Mismatch: Reset Local Database?',
        cancel: true,
        ok: okAction
     }
  });
}

