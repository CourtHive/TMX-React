import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MatchOutcomeDialog } from 'components/dialogs/matchUpOutcomeDialog/MatchUpOutcomeDialog';

export const MatchOutcomeContainer = (props) => {
  const dispatch = useDispatch();
  const { matchUp, closeDialog } = props;

  const initialOutcome = {
    matchUpStatus: matchUp?.matchUpStatus,
    score: matchUp?.score
  };
  const [outcome, setOutcome] = useState(initialOutcome);

  const processScoringOutcome = ({ outcome, matchUp }) => {
    const { matchUpFormat } = outcome;
    const { drawId, matchUpId, matchUpTieId } = matchUp;
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'setMatchUpStatus',
            params: { drawId, matchUpId, matchUpTieId, matchUpFormat, outcome }
          }
        ]
      }
    });
  };
  const handleAcceptOutcome = () => {
    if (matchUp) processScoringOutcome({ outcome, matchUp });
    closeDialog();
  };

  const handleSetOutcome = ({ outcome }) => {
    setOutcome(outcome);
  };

  return (
    <>
      <MatchOutcomeDialog
        isOpen={!!matchUp}
        matchUp={matchUp}
        setOutcome={handleSetOutcome}
        acceptOutcome={handleAcceptOutcome}
        closeDialog={closeDialog}
      />
    </>
  );
};
