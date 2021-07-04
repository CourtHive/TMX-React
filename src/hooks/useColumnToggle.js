import * as React from 'react';

const ColumnContext = React.createContext();

const columnPresets = {
  calendar: ['provider'],
  draws: ['scheduled', 'completed'],
  events: ['rank', 'indoorOutdoor', 'surfaceCategory'],
  matchUps: ['event', 'format', 'scheduleTime', 'startTime', 'endTime', 'umpire'],
  eventParticipants: ['firstName', 'lastName', 'seedPosition', 'otherName', 'ioc'],
  participants: ['firstName', 'lastName', 'otherName']
};

function columnReducer(state, action) {
  if (!action.table) throw new Error(`Invalid Table`);
  if (typeof action.columnName !== 'string') throw new Error(`Invalid Value: ${action.columnName}`);

  const currentTable = state[action.table] || [];

  if (currentTable.includes(action.columnName)) {
    const hiddenColumns = currentTable.filter((columnName) => columnName !== action.columnName);
    return { ...state, [action.table]: hiddenColumns };
  } else {
    return { ...state, [action.table]: currentTable.concat(action.columnName) };
  }
}
function ColumnProvider({ children }) {
  const [state, dispatch] = React.useReducer(columnReducer, columnPresets);
  // NOTE: *might* need to memoize... Learn more http://kcd.im/optimize-context
  const value = { state, dispatch };
  return <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>;
}
function useColumnToggle() {
  const context = React.useContext(ColumnContext);
  if (context === undefined) {
    throw new Error('useColumnToggle must be used within a ColumnProvider');
  }
  return context;
}
export { ColumnProvider, useColumnToggle };
