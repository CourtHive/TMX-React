import * as React from 'react';

const ColumnContext = React.createContext();

function columnReducer(state, action) {
  if (!action.table || !state[action.table]) throw new Error(`Invalid Table`);
  if (!action.columnName) throw new Error(`Missing Colunn Value`);
  if (typeof action.columnName !== 'string') throw new Error(`Invalid Value: ${action.columnName}`);

  if (state[action.table].includes(action.columnName)) {
    const hiddenColumns = state[action.table].filter((columnName) => columnName !== action.columnName);
    return { ...state, [action.table]: hiddenColumns };
  } else {
    return { ...state, [action.table]: state[action.table].concat(action.columnName) };
  }
}
function ColumnProvider({ children }) {
  const [state, dispatch] = React.useReducer(columnReducer, { calendar: ['provider'] });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
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
