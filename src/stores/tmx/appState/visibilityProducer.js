import produce from 'immer';

const visibleDrawer = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.drawer = action.payload;
  });
const mainMenu = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.mainMenu = action.payload;
  });
const visibleDialog = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.dialog = action.payload;
  });

const setActiveTab = (state, action) =>
  produce(state, (draftState) => {
    const { tab, iconTabs } = action.payload;
    draftState.visible.tabPanel = tab;
    draftState.scoringTieMatchUp = null;
    if (iconTabs) draftState.visible.iconTabs = true;
  });
const setDrawView = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.drawView = action.payload;
  });
const setTournamentView = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.tournamentView = action.payload;
  });
const setParticipantView = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.participantView = action.payload;
  });
const setLocationView = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.locationView = action.payload;
  });
const setVisibleDual = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.dualMatch = action.payload;
  });
const schedulingActive = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.unscheduledMatches = action.payload;
  });
const locationsVisible = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.locationsList = action.payload;
  });

const setInitialState = (state, action) =>
  produce(state, (draftState) => {
    if (action.payload.enabledComponents) draftState.enabled.components = action.payload.enabledComponents;
    if (action.payload.visibleTabs) draftState.visible.tabs = action.payload.visibleTabs;
    draftState.initialized = true;
  });

const specifyVisibleTabs = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.tabs = action.payload;
  });
const makeTabsVisible = (state, action) =>
  produce(state, (draftState) => {
    const tabs = action.payload || [];
    const visible = draftState.visible.tabs;
    const invisible = tabs.reduce((p, c) => (visible.indexOf(c) < 0 ? p.concat(c) : p), []);
    if (invisible.length) {
      draftState.visible.tabs = draftState.visible.tabs.concat(...invisible).sort();
    }
  });
const makeTabsInvisible = (state, action) =>
  produce(state, (draftState) => {
    const tabs = action.payload || [];
    draftState.visible.tabs = draftState.visible.tabs.filter((t) => tabs.indexOf(t) < 0).sort();
    if (draftState.visible.tabs.indexOf(draftState.visible.tabPanel) < 0)
      draftState.visible.tabPanel = draftState.visible.tabs[0];
  });
const setAlertDialog = (state, action) =>
  produce(state, (draftState) => {
    draftState.visible.alertDialog = action.payload;
  });

const visibilityProducer = {
  'set initial state': setInitialState,
  'change active tab': setActiveTab,

  'set draw view': setDrawView,
  'set location view': setLocationView,
  'set tournament view': setTournamentView,
  'set participant view': setParticipantView,

  'specify tabs': specifyVisibleTabs,
  'hide tabs': makeTabsInvisible,
  'show tabs': makeTabsVisible,

  'schedule state': schedulingActive,

  'display locations': locationsVisible,
  'set visible dual': setVisibleDual,
  'visible dialog': visibleDialog,
  'visible drawer': visibleDrawer,
  mainMenu: mainMenu,

  'alert dialog': setAlertDialog
};

export default visibilityProducer;
