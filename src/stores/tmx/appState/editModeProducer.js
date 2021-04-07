import produce from 'immer';

const editState = (state, action) =>
  produce(state, (draftState) => {
    draftState.editState = action && action.payload;
  });

const editModeProducer = {
  'edit state': editState
};

export default editModeProducer;
