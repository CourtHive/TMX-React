import { SPACE_CHARACTER, SET_TIEBREAK_BRACKETS, SCORE_JOINER } from 'functions/scoring/scoreEntry/constants';

import { getWinningSide } from 'functions/scoring/scoreEntry/winningSide';

export function calcSetScore({ analysis, lowSide, matchUp, value }) {
  const { setTo, tiebreakAt, NoAD } = analysis.setFormat;
  const needsTiebreak = value === parseInt(tiebreakAt || setTo);

  if (tiebreakAt && tiebreakAt < setTo && value > tiebreakAt) return matchUp;
  if ((NoAD && value === setTo) || value > setTo) return matchUp;

  const highValue = getHighSetValue();
  const setScores = [value, highValue];
  if (lowSide === 2) setScores.reverse();

  const brackets = SET_TIEBREAK_BRACKETS;
  const open = brackets.split('')[0];
  const addition = setScores.join(SCORE_JOINER) + (needsTiebreak ? open : SPACE_CHARACTER);
  const score = (matchUp.score || '') + addition;

  const set = {
    side1Score: setScores[0],
    side2Score: setScores[1]
  };
  const winningSide = getWinningSide({ analysis, set });
  set.winningSide = winningSide || undefined;

  return { score, set };

  function getHighSetValue() {
    if (needsTiebreak) return value + 1;
    if (value + 1 === setTo) {
      return value + (NoAD ? 1 : 2);
    }
    return setTo;
  }
}
