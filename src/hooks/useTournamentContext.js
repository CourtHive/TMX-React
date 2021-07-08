import * as React from 'react';

import { tournamentEngine, competitionEngine } from 'tods-competition-factory';

const TOURNAMENT_ENGINE = 'tournamentEngine';
const COMPETITION_ENGINE = 'competitionEngine';

const TournamentContext = React.createContext();

function TournamentProvider({ children }) {
  const [tournamentState, setTournamentState] = React.useState({ tournamentId: undefined, tournamentRecords: {} });
  competitionEngine.setDeepCopy(false);

  function setTournamentRecords(records) {
    const result = competitionEngine.setState(records);
    if (result.error) {
      throw new Error(result.error);
    } else {
      const { tournamentRecords } = competitionEngine.getState();
      const tournamentIds = Object.keys(tournamentRecords);
      const tournamentId =
        tournamentState.tournamentId && tournamentIds.includes(tournamentState.tournamentId)
          ? tournamentState.tournamentId
          : tournamentIds[0];
      setTournamentState({ tournamentId, tournamentRecords });
    }
  }

  function setTournamentId(tournamentId) {
    const tournamentIds = Object.keys(tournamentState.tournamentRecords);
    const newTournamentId = tournamentIds.includes(tournamentId) ? tournamentId : tournamentIds[0];
    setTournamentState({ ...tournamentState, tournamentId: newTournamentId });
  }

  function engineMethods({ engine, methods }) {
    const result = !tournamentState.tournamentId
      ? { error: 'No Tournament Record(s)' }
      : engine === TOURNAMENT_ENGINE
      ? tournamentEngine.executionQueue(methods)
      : engine === COMPETITION_ENGINE
      ? competitionEngine.executionQueue(methods)
      : { error: `Invalid engine` };

    if (result.error) {
      throw new Error(`Engine: ${engine}, Error: ${result.error}`);
    } else {
      const { tournamentRecords } = competitionEngine.getState();
      setTournamentState({ ...tournamentState, tournamentRecords });
    }
  }
  const value = { setTournamentId, tournamentState, setTournamentRecords, engineMethods };
  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}
function useTournamentContext() {
  const context = React.useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournamentContext must be used within a TournamentProvider');
  }
  return context;
}
export { TournamentProvider, useTournamentContext };
