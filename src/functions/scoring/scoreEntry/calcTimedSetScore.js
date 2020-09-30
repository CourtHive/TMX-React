import { processOutcome } from 'functions/scoring/scoreEntry/processOutcome';
import { removeFromScore } from 'functions/scoring/scoreEntry/scoreUtilities';

import { BACKSPACE, OUTCOMEKEYS, SCORE_JOINER, SPACE_KEY } from 'functions/scoring/scoreEntry/constants';

export function calcTimedSetScore({ analysis, lowSide, matchUp, message, value }) {
  let updated, outcomeRemoved;
  let { score, sets } = matchUp;
  if (!sets?.length && value !== BACKSPACE) sets = [{ setNumber: 1 }];
  const setIndex = sets.length - 1;

  if (OUTCOMEKEYS.includes(value)) {
    const lastSet = sets[sets.length - 1] || {};
    const { side1Score, side2Score } = lastSet;
    if (side1Score && !side2Score) {
      message = 'missing side2Score';
    } else if (analysis.finalSetIsComplete || analysis.hasWinningSide) {
      message = 'final set is already complete';
    } else if (analysis.isIncompleteSetScore) {
      message = 'incomplete set score';
    } else if (!analysis.isIncompleteSetScore) {
      ({ sets, score, matchUp, updated } = processOutcome({ lowSide, matchUp, value }));
    }
  } else if (value === BACKSPACE) {
    ({ score, sets, outcomeRemoved } = removeFromScore({ analysis, matchUp }));
    if (!score) sets = [];

    if (outcomeRemoved) {
      const lastSet = sets[sets.length - 1] || {};
      const { side1Score, side2Score } = lastSet;
      if (side1Score && side2Score) {
        const winningSide = side1Score > side2Score ? 1 : side2Score > side1Score ? 2 : undefined;
        if (winningSide) {
          lastSet.winningSide = winningSide;
          sets.push({ setNumber: sets.length + 1 });
        }
      }
    }
    matchUp.matchUpStatus = undefined;
    matchUp.winningSide = undefined;
    updated = true;
  } else if (analysis.hasOutcome) {
    message = 'has outcome';
  } else if (analysis.hasWinningSide) {
    return { matchUp, updated: false, message: 'matchUp is complete' };

    // SPACE_KEY indicates moving on to next set
  } else if (value === SPACE_KEY) {
    const lastSet = sets[sets.length - 1] || {};
    const { side1Score, side2Score } = lastSet;
    const winningSide = side1Score > side2Score ? 1 : side2Score > side1Score ? 2 : undefined;

    if (winningSide && !matchUp.winningSide && !analysis.isIncompleteSetScore) {
      sets[sets.length - 1].winningSide = winningSide;
      sets.push({ setNumber: sets.length + 1 });
      score += ' ';
      updated = true;
    }

    // SCORE_JOINGER is only valid if side1Score exists and side2Score doesn't exist
  } else if (
    value === SCORE_JOINER &&
    sets[setIndex].side1Score !== undefined &&
    sets[setIndex].side2Score === undefined &&
    score &&
    analysis.isNumericEnding
  ) {
    score += '-';
    sets[setIndex].side2Score = 0;

    matchUp.matchUpStatus = undefined;
    matchUp.winningSide = undefined;
    updated = true;
  } else if (!isNaN(value)) {
    const greaterThanZero = parseInt(value) > 0;

    if (sets[setIndex].side2Score === undefined) {
      // if side2Score is undefined then add value to first set score
      if (greaterThanZero || sets[setIndex].side1Score) {
        sets[setIndex].side1Score = parseInt((sets[setIndex].side1Score || 0).toString() + value);
        const newScore = (score || '') + value;
        score = newScore;
        updated = true;
      }
    } else {
      // if side2Score is NOT undefined then add value to second set score
      if (greaterThanZero || sets[setIndex].side2Score) {
        sets[setIndex].side2Score = parseInt((sets[setIndex].side2Score || 0).toString() + value);
        const newScore = (score.trim() || '') + value;
        score = newScore;
        updated = true;
      }
    }
  }

  return { sets, score, message, updated };
}
