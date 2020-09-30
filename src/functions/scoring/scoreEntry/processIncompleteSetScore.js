import { SPACE_CHARACTER, SET_TIEBREAK_BRACKETS } from 'functions/scoring/scoreEntry/constants';

import { getWinningSide } from 'functions/scoring/scoreEntry/winningSide';

export function processIncompleteSetScore({ analysis, score, sets, value, matchUp }) {
  let updated;

  const set = sets[sets.length - 1];
  value = parseInt(value);
  const { validSide2Score, requiresTiebreak } = checkValidSide2Score({ analysis, set, value });

  if (validSide2Score) {
    updated = true;
    score = (matchUp.score || '') + value;
    set.side2Score = value;

    const winningSide = getWinningSide({ analysis, set: sets[sets.length - 1] });
    set.winningSide = winningSide || undefined;

    if (requiresTiebreak) {
      const open = SET_TIEBREAK_BRACKETS.split('')[0];
      score += open;
    } else if (!analysis.isDecidingSet) {
      score += SPACE_CHARACTER;
    }
  }

  return { sets, score, updated };
}

function checkValidSide2Score({ analysis, set, value }) {
  const setFormat =
    (analysis.isDecidingSet && analysis.matchUpScoringFormat.finalSetFormat) || analysis.matchUpScoringFormat.setFormat;
  const { tiebreakAt, setTo } = setFormat;
  const { side1Score } = set;

  let validSide2Score, requiresTiebreak;

  if (tiebreakAt && tiebreakAt < setTo) {
    if (side1Score === tiebreakAt) {
      validSide2Score = value <= setTo;
    } else {
      validSide2Score = value <= tiebreakAt;
    }
  } else if (side1Score === setTo) {
    validSide2Score = value <= setTo + 1;
  } else if (side1Score === setTo - 1) {
    validSide2Score = value <= setTo + 1;
  } else if (side1Score === setTo + 1) {
    validSide2Score = value === setTo || value === setTo - 1;
  } else {
    validSide2Score = value <= setTo;
  }

  if (validSide2Score) {
    if (tiebreakAt && tiebreakAt < setTo) {
      requiresTiebreak =
        (side1Score === setTo && value === tiebreakAt) || (side1Score === tiebreakAt && value === setTo);
    } else {
      requiresTiebreak = side1Score >= setTo && value >= setTo && side1Score !== value;
    }
  }

  return { validSide2Score, requiresTiebreak };
}
