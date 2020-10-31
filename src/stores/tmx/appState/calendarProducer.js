import produce from 'immer';

const changeCategory = (state, action) =>
  produce(state, (draftState) => {
    draftState.category = action.payload;
  });
const changeStartDate = (state, action) =>
  produce(state, (draftState) => {
    draftState.startDate = action.payload;
  });

const calendarProducer = {
  'change calendar category': changeCategory,
  'change calendar startDate': changeStartDate
};

export default calendarProducer;
