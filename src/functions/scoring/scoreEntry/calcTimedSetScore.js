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
    if (score.trim() === '') {
      score = score.trim();
    }
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
    let currentSetScore;

    if (sets[setIndex].side2Score === undefined) {
      const newValue = parseInt((sets[setIndex].side1Score || 0).toString() + value)
        .toString()
        .slice(0, 2);
      sets[setIndex].side1Score = parseInt(newValue);
      currentSetScore = sets[setIndex].side1Score.toString();
      updated = true;
    } else {
      const newValue = parseInt((sets[setIndex].side2Score || 0).toString() + value)
        .toString()
        .slice(0, 2);
      sets[setIndex].side2Score = parseInt(newValue);
      currentSetScore = [sets[setIndex].side1Score, sets[setIndex].side2Score].join('-');
      updated = true;
    }
    if (updated) {
      const priorSetScores = (sets.slice(0, setIndex) || [])
        .map((set) => {
          const { side1Score, side2Score } = set;
          return [side1Score, side2Score].join('-');
        })
        .join(' ');
      score = priorSetScores + ' ' + currentSetScore;
    }
  }

  return { sets, score, message, updated };
}
