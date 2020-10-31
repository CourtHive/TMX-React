import { combineReducers, createStore } from 'redux';

import tmxReducer from 'stores/tmx/reducer';

const rootReducer = combineReducers({ tmx: tmxReducer });

export const tmxStore = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
