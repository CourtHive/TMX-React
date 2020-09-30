import { isDev } from 'functions/isDev';
import storeInitialState from './storeInitialState';

import rootProducer from './appState/rootProducer';
import calendarProducer from './appState/calendarProducer';
import editModeProducer from './appState/editModeProducer';
import selectionProducer from './appState/selectionProducer';
import visibilityProducer from './appState/visibilityProducer';
import actionDataProducer from './appState/actionDataProducer';

import matchesProducer from 'stores/tmx/competition/scoringProducer';
import tournamentProducer from 'stores/tmx/competition/tournamentProducer';
import competitionProducer from 'stores/tmx/competition/competitionProducer';

const initialState = storeInitialState();

const createReducer = handlers => (state=initialState, action) => {
    if (!Object.keys(handlers).includes(action.type)) { return state; }
    if (isDev()) {
        return handlers[action.type](state, action);
    } else {
        try { return handlers[action.type](state, action); }
        catch (err) { console.log('%c ERROR', 'color: orange', {err}); }
    }
};

const producerArray = [
    rootProducer,
    calendarProducer,
    editModeProducer,
    selectionProducer,
    visibilityProducer,
    actionDataProducer,

    matchesProducer,
    tournamentProducer,
    competitionProducer,
];

const producers = Object.assign({}, ...producerArray);

export default createReducer(producers);