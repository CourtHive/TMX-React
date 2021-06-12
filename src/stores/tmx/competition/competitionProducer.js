import produce from 'immer';

import { context } from 'services/context';
import { setToasterState } from '../primitives/toasterState';
import { isDev } from 'functions/isDev';

// import { competitionEngine } from 'competitionFactory';
import { competitionEngine } from 'tods-competition-factory';

/*
  generic competitionEngine producer
  dispatch({ type: 'competitionEngine', method: 'xyz', payload: { params } })
*/
const invokeCompetitionEngine = (state, action) =>
  produce(state, (draftState) => {
    const tournamentRecords = draftState.records;
    if (!tournamentRecords) {
      return console.log('%c Missing tournamentRecords', 'color: red');
    }

    const { method } = action;
    const methods = Object.keys(competitionEngine);

    if (method && methods.includes(method)) {
      const result = competitionEngine.devContext(isDev()).setState(tournamentRecords)[method](action.payload);

      if (result) {
        if (result.success) {
          const { tournamentIds } = Object.keys(tournamentRecords);
          context.ee.emit('emitTmx', {
            action: 'competitionEngineMethod',
            payload: { tournamentIds, method, payload: action.payload }
          });

          draftState.records = competitionEngine.getState();
          console.log('competitionEngine saveTrigger');
          ++draftState.saveCount;
        } else if (result.error) {
          const payload = { icon: 'error', severity: 'warning', message: result.error };
          setToasterState({ draftState, payload });
        } else if (result.errors) {
          console.log({ errors: result.errors });
        }
      }
    } else {
      console.log(`%c competitionEngine Method not found: ${method}`, 'color: pink');
    }
  });

export const competitionProducer = {
  competitionEngine: invokeCompetitionEngine
};

export default competitionProducer;
