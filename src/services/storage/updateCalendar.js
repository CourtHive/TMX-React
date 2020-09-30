import { db } from 'services/storage/db';
import { performTask } from 'functions/tasks';
import { populateCalendar } from 'functions/calendar';
import { tmxStore } from 'stores/tmxStore';

export function updateCalendar({ tournaments, merge }) {
  const failure = (error) => {
    console.log({ error });
    tmxStore.dispatch({ type: 'loading state', payload: false });
  };
  const done = () => {
    tmxStore.dispatch({ type: 'loading state', payload: false });
    populateCalendar();
  };
  const addNew = (tournaments) => {
    console.log('addNew', { tournaments });
    performTask(db.addTournament, tournaments, false).then(done, failure);
  };

  if (merge) {
    performTask(mergeTournament, tournaments, false).then(done, failure);
  } else {
    console.log('add');
    addNew(tournaments);
  }
}

function mergeTournament(tournament) {
  return new Promise((resolve, reject) => {
    const tournamentId = tournament.unifiedTournamentId?.tournamentId || tournament.tournamentid;
    if (!tournamentId) reject({ error: 'Missing tournamentId' });
    db.findTournament(tournamentId).then(mergeExisting, (err) => console.log(err));
    function mergeExisting(existing) {
      if (!existing) {
        db.addTournament(tournament).then(resolve, reject);
      } else {
        resolve();
      }
    }
  });
}
