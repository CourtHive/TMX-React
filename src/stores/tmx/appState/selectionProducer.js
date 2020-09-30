import produce from 'immer';

const selectAdhocRound = (state, action) =>
  produce(state, (draftState) => {
    if (action.payload) {
      draftState.select.draws.round = action.payload;
    }
  });
const selectStructure = (state, action) =>
  produce(state, (draftState) => {
    const { structureId } = action.payload;
    draftState.select.draws.structureId = structureId;
  });
const selectDrawsDraw = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.draws.draw = action.payload;
    draftState.select.draws.structureId = '';
  });
const setSelectedTeam = (state, action) =>
  produce(state, (draftState) => {
    const { teamContext, selectedTeamId } = action.payload;
    draftState.select[teamContext].team = selectedTeamId;
  });
const setSelectedVenue = (state, action) =>
  produce(state, (draftState) => {
    const venueId = action.payload?.venueId;
    draftState.select.venues.venue = venueId;
  });
const selectScheduleRound = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.schedule.round = action.payload;
  });

const selectEvent = (state, action) =>
  produce(state, (draftState) => {
    const selectedEventId = action.payload;
    const existingDrawId = draftState.select.draws.draw;
    draftState.select.events.event = selectedEventId;

    const tournamentId = draftState.selectedTournamentId;
    const tournamentRecord = draftState.records[tournamentId];
    const tournamentEvents = tournamentRecord.events || [];
    const selectedEvent = tournamentEvents.reduce((p, c) => (c.eventId === selectedEventId ? c : p), undefined);
    const firstDrawId = selectedEvent?.drawDefinitions && selectedEvent?.drawDefinitions[0]?.drawId;
    if (firstDrawId && selectedEventId && existingDrawId) {
      draftState.select.draws.draw = firstDrawId;
    } else {
      draftState.select.draws.draw = undefined;
    }
  });
const selectEventDraw = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.draws.draw = action.payload;
  });
const clearEventSelections = (state) =>
  produce(state, (draftState) => {
    draftState.select.events.event = undefined;
    draftState.select.draws.draw = undefined;
  });
const scheduleDay = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.schedule.day = action.payload;
  });
const signedInStatus = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.participants.signedIn = action.payload;
  });
const selectSex = (state, action) =>
  produce(state, (draftState) => {
    draftState.select.participants.sex = action.payload;
  });

const selectionProducer = {
  'select schedule round': selectScheduleRound,
  'select adhoc round': selectAdhocRound,
  'select draws draw': selectDrawsDraw,
  'select structure': selectStructure,
  'select venue': setSelectedVenue,
  'select team': setSelectedTeam,

  'clear event selections': clearEventSelections,
  'select event draw': selectEventDraw,
  'select event': selectEvent,

  'schedule day': scheduleDay,
  'participant sex': selectSex,

  'participant signedIn': signedInStatus
};

export default selectionProducer;
