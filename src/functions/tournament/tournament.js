import { db } from 'services/storage/db';
import { populateCalendar } from 'functions/calendar';
import { dropModal } from 'components/forms/dragDropModal';
import { loadFile } from 'services/files/importing/loadFile';
import { utilities } from 'tods-competition-factory';

export function saveNewTournament(tournament) {
  if (!tournament || !Object.keys(tournament).length) return;

  const tournamentId = utilities.UUID();
  tournament.tournamentId = tournamentId;
  tournament.unifiedTournamentId = { tournamentId };

  function refresh() {
    populateCalendar();
  }
  db.addTournament(tournament).then(refresh, console.log);
}

export function importTournamentRecord() {
  dropModal({ callback: loadAndGo });
  function loadAndGo(file) {
    loadFile(file, populateCalendar);
  }
}
