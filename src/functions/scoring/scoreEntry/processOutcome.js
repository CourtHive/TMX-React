import {
  OUTCOME_DEFAULT,
  OUTCOME_RETIREMENT,
  OUTCOME_WALKOVER,
  STATUS_DEFAULT,
  STATUS_RETIREMENT,
  STATUS_WALKOVER,
  STATUS_ABANDONED,
  STATUS_INTERRUPTED,
  STATUS_SUSPENDED,
  RETIRE,
  DEFAULT,
  WALKOVER,
  ABANDON,
  INTERRUPT,
  SUSPEND,
  OUTCOME_ABANDONED,
  OUTCOME_INTERRUPTED,
  OUTCOME_SUSPENDED
} from 'functions/scoring/scoreEntry/constants';

import { addOutcome } from 'functions/scoring/scoreEntry/scoreUtilities';

export function processOutcome({ lowSide, value, matchUp }) {
  let updated, score;
  let sets = matchUp.sets;

  if (value === RETIRE) {
    if (matchUp.score) {
      updated = true;
      score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_RETIREMENT });
      matchUp.winningSide = lowSide === 2 ? 1 : 2;
      matchUp.matchUpStatus = STATUS_RETIREMENT;
    } else {
      updated = true;
      score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_DEFAULT });
      matchUp.winningSide = lowSide === 2 ? 1 : 2;
      matchUp.matchUpStatus = STATUS_DEFAULT;
    }
  } else if (value === DEFAULT) {
    updated = true;
    score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_DEFAULT });
    matchUp.winningSide = lowSide === 2 ? 1 : 2;
    matchUp.matchUpStatus = STATUS_DEFAULT;
  } else if (value === WALKOVER) {
    updated = true;
    sets = [];
    score = OUTCOME_WALKOVER;
    matchUp.winningSide = lowSide === 2 ? 1 : 2;
    matchUp.matchUpStatus = STATUS_WALKOVER;
  } else if (value === SUSPEND && matchUp.score) {
    updated = true;
    score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_SUSPENDED });
    matchUp.matchUpStatus = STATUS_SUSPENDED;
    matchUp.winner = undefined;
  } else if (value === ABANDON) {
    updated = true;
    score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_ABANDONED });
    matchUp.matchUpStatus = STATUS_ABANDONED;
    matchUp.winner = undefined;
  } else if (value === INTERRUPT && matchUp.score) {
    updated = true;
    score = addOutcome({ score: matchUp.score, lowSide, outcome: OUTCOME_INTERRUPTED });
    matchUp.matchUpStatus = STATUS_INTERRUPTED;
    matchUp.winner = undefined;
  }

  return { updated, sets, score, matchUp };
}
