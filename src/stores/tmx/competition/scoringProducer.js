import produce from "immer";

const scoringDetails = (state, action) =>
  produce(state, (draftState) => {
    if (!action.payload) {
      draftState.scoringDetails = undefined;
    } else {
      const { matchUp } = action.payload;
      const tieFormat = matchUp && matchUp.tieFormat;

      if (tieFormat) {
        draftState.scoringTieMatchUp = action.payload;
      } else {
        draftState.scoringDetails = action.payload;
      }
    }
  });

const scoringTieMatchUp = (state, action) =>
  produce(state, (draftState) => {
    draftState.scoringTieMatchUp = action.payload;
  });

export const matchesProducer = {
  'scoring details': scoringDetails,
  'scoring tieMatchUp': scoringTieMatchUp,
}

export default matchesProducer;
