import produce from 'immer';

import { setToasterState } from '../primitives/toasterState';

const setAuthState = (state, action) =>
  produce(state, (draftState) => {
    draftState.authState = action.payload;
  });
const displayCalendar = (state) =>
  produce(state, (draftState) => {
    draftState.content = 'calendar';
  });
const displaySplash = (state) =>
  produce(state, (draftState) => {
    draftState.content = 'splash';
  });
const displayTournament = (state) =>
  produce(state, (draftState) => {
    draftState.content = 'tournament';
  });

const loginModal = (state, action) =>
  produce(state, (draftState) => {
    draftState.loginModal = action && action.payload;
  });
const specifyEnabledComponents = (state, action) =>
  produce(state, (draftState) => {
    draftState.enabled.components = action.paylod;
  });

const hideColumn = (state, action) =>
  produce(state, (draftState) => {
    if (action.payload.hidden) {
      draftState.hiddenColumns[action.payload.table].push(action.payload.field);
    } else {
      draftState.hiddenColumns[action.payload.table] = draftState.hiddenColumns[action.payload.table].filter(
        (i) => i !== action.payload.field
      );
    }
  });

const setLoadingState = (state, action) =>
  produce(state, (draftState) => {
    draftState.loadingState = action.payload;
  });
const dbLoaded = (state, action) =>
  produce(state, (draftState) => {
    draftState.dbLoaded = action.payload;
  });
const pubAction = (state) =>
  produce(state, (draftState) => {
    const timestamp = new Date().getTime();
    draftState.pubAction = timestamp;
  });

const setDrawData = (state, action) =>
  produce(state, (draftState) => {
    draftState.drawData = action.payload;
  });
const setIconTabs = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.tabState = action.payload;
  });

const setMyTournaments = (state, action) =>
  produce(state, (draftState) => {
    draftState.myTournaments = action.payload;
  });

const drawResizeEvent = (state) =>
  produce(state, (draftState) => {
    draftState.drawResize++;
  });
const incrementKeyLoads = (state, action) =>
  produce(state, (draftState) => {
    const { payload } = action || {};
    const tournamentId = draftState.selectedTournamentId;
    const tournamentRecord = tournamentId && draftState.records[tournamentId];

    if (tournamentRecord && payload && payload.orgAbbr) {
      const org = tournamentRecord.unifiedTournamentId?.organisation;
      const isTourneyOrg = org?.organisationAbbreviation === payload.orgAbbr;
      const editing = isTourneyOrg || !org?.organisationId;
      draftState.editState = editing;
    }
    draftState.keyLoads++;
  });

const changeToasterState = (state, action) =>
  produce(state, (draftState) => {
    if (action.payload) {
      setToasterState({ draftState, payload: action.payload });
      // draftState.toasterState.visible = true;
      // Object.assign(draftState.toasterState, action.payload);
    } else {
      draftState.toasterState.visible = null;
      draftState.toasterState.message = '';
    }
  });

const rootProducer = {
  'display tournament': displayTournament,
  'display calendar': displayCalendar,
  'display splash': displaySplash,

  'db loaded': dbLoaded,
  'key loaded': incrementKeyLoads,
  'specify components': specifyEnabledComponents,

  'login modal': loginModal,
  'tournament auth state': setAuthState,

  'hide column': hideColumn,

  'loading state': setLoadingState,
  'publish action': pubAction,

  'toaster state': changeToasterState,

  'set drawData': setDrawData,
  'set icon tabs': setIconTabs,
  'set myTournaments': setMyTournaments,

  'draw resize event': drawResizeEvent
};

export default rootProducer;
