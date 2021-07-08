import * as React from 'react';

const TournamentContext = React.createContext();

function TournamentProvider({ children }) {
  const [tournamentRecord, setTournamentRecord] = React.useState({});
  const value = { tournamentRecord, setTournamentRecord };
  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}
function useTournamentContext() {
  const context = React.useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useColumnToggle must be used within a ColumnProvider');
  }
  return context;
}
export { TournamentProvider, useTournamentContext };
