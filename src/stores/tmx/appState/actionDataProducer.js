import produce from 'immer';

const setAutoDrawOptions = (state, action) =>
  produce(state, (draftState) => {
    draftState.actionData.autoDraw = action.payload;
  });
const swapDrawPosition = (state, action) =>
  produce(state, (draftState) => {
    draftState.actionData.swapDrawPosition = action && action.payload;
  });

const actionDataProducer = {
  'swap draw position': swapDrawPosition,
  'auto draw options': setAutoDrawOptions,
};

export default actionDataProducer;
