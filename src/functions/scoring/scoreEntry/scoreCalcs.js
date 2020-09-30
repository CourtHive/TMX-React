import { indices } from 'functions/arrays';

import {
  SET_TIEBREAK_BRACKETS,
  MATCH_TIEBREAK_BRACKETS,
  SPACE_CHARACTER,
  BACKSPACE,
  OUTCOMEKEYS,
  OUTCOME_COMPLETE,
  VALID_CALC_KEYS,
  SCORE_JOINER,
  MATCH_TIEBREAK_JOINER,
  ALTERNATE_JOINERS,
  ZERO,
  CLOSERS,
  SPACE_KEY,
  STATUS_SUSPENDED,
  STATUS_INTERRUPTED,
  STATUS_ABANDONED
} from 'functions/scoring/scoreEntry/constants';

import { calcSetScore } from 'functions/scoring/scoreEntry/calcSetScore';
import { processOutcome } from 'functions/scoring/scoreEntry/processOutcome';

import { getMatchUpWinner, removeFromScore, getHighTiebreakValue } from 'functions/scoring/scoreEntry/scoreUtilities';

import { getWinningSide, getLeadingSide } from 'functions/scoring/scoreEntry/winningSide';

import { processTiebreakSet } from './processTiebreakSet';
import { processIncompleteSetScore } from './processIncompleteSetScore';
import { getScoreAnalysis } from './scoreAnalysis';
import { calcTimedSetScore } from './calcTimedSetScore';

/* shiftFirst indicates that SHIFT key refers to first opponent, rather than second */
export function calcScore(props) {
  const { shiftFirst, auto = true, checkFormat } = props;
  let { lowSide = 1, value, matchUp, matchUpFormat } = props;
  const isShifted = (shiftFirst && lowSide === 2) || (!shiftFirst && lowSide === 1);
  let updated, message;

  if (!matchUp) return { updated, message: 'Missing matchUp' };
  if (!VALID_CALC_KEYS.includes(value)) {
    return { matchUp, updated, message: 'invalid key' };
  }

  if (shiftFirst) lowSide = 3 - lowSide;

  let { score, sets } = matchUp;

  matchUpFormat = matchUpFormat || matchUp.matchUpFormat;
  if (checkFormat && matchUpFormat !== matchUp.matchUpFormat) {
    score = undefined;
    sets = [];
  }

  const analysis = getScoreAnalysis({ ...props, score, sets, matchUpFormat });

  if (ALTERNATE_JOINERS.includes(value)) value = SCORE_JOINER;
  if (analysis.hasOpener && analysis.isTiebreakEntry && !analysis.isTiebreakSet && isShifted && parseInt(value) === 0) {
    analysis.isTiebreakCloser = true;
  }

  if (CLOSERS.includes(value) && analysis.hasOpener) {
    value = '';
  }

  if (CLOSERS.includes(value)) {
    // TODO: not sure this is necessary
    value = SPACE_KEY;
  }

  if (analysis.lastSetIsComplete) {
    const finalCharacter = score[score.length - 1];
    if (finalCharacter !== ' ') {
      matchUp.score += ' ';
    }
  }

  if (analysis.isTimedSet) {
    ({ message, sets, score, updated } = calcTimedSetScore({ analysis, lowSide, matchUp, value }));
  } else if (OUTCOMEKEYS.includes(value)) {
    if (analysis.finalSetIsComplete || analysis.hasWinningSide) {
      message = 'final set is already complete';
    } else if (!analysis.isTiebreakEntry && !analysis.isIncompleteSetScore) {
      ({ sets, score, matchUp, updated } = processOutcome({ lowSide, matchUp, value }));
    } else if (analysis.isTiebreakEntry || analysis.isIncompleteSetScore) {
      message = 'incomplete set score or tiebreak entry';
    } else {
      console.log('handle case', { value });
    }
  } else if (value === BACKSPACE) {
    updated = true;
    ({ score, sets } = removeFromScore({ analysis, matchUp, lowSide, auto }));
    if (!score) sets = [];
    matchUp.matchUpStatus = undefined;
    matchUp.winningSide = undefined;
  } else if (analysis.hasOutcome) {
    message = 'has outcome';
  } else if (value === SCORE_JOINER && !analysis.isMatchTiebreakEntry) {
    if (!analysis.isSetTiebreakEntry || (analysis.isSetTiebreakEntry && !analysis.isNumericEnding)) {
      updated = true;
      ({ score, sets } = removeFromScore({ analysis, matchUp, lowSide, auto }));
      matchUp.matchUpStatus = undefined;
    }
  } else if (value === MATCH_TIEBREAK_JOINER && analysis.isMatchTiebreakEntry && !analysis.isSetTiebreakEntry) {
    if (analysis.matchTiebreakHasJoiner) {
      message = 'existing joiner';
    } else if (analysis.isNumericEnding) {
      updated = true;
      score += MATCH_TIEBREAK_JOINER;
    }
  } else if ([SCORE_JOINER, MATCH_TIEBREAK_JOINER].includes(value)) {
    message = 'invalid location for joiner';
  } else if (analysis.hasWinningSide) {
    return { matchUp, updated: false, message: 'matchUp is complete' };
  } else if (analysis.isIncompleteSetScore) {
    if (analysis.isNumericValue) {
      ({ sets, score, updated } = processIncompleteSetScore({ analysis, score, sets, matchUp, value }));
    }
  } else if (analysis.isInvalidMatchTiebreakValue) {
    message = 'invalid match tiebreak character';
  } else if (analysis.isInvalidSetTiebreakValue) {
    message = 'invalid set tiebreak character';
  } else if (analysis.isTiebreakCloser) {
    const brackets = analysis.isSetTiebreakEntry ? SET_TIEBREAK_BRACKETS : MATCH_TIEBREAK_BRACKETS;
    const close = brackets.split('').reverse()[0];
    const open = brackets.split('')[0];
    const set = sets[sets.length - 1];

    const { tiebreakFormat } = analysis.setFormat;
    const { tiebreakTo, NoAD } = tiebreakFormat || {};
    const leadingSide = getLeadingSide({ set });

    if (!analysis.isTiebreakSet) {
      const lowTiebreakScore = parseInt(matchUp.score.split(open).reverse()[0]);
      const highTiebreakScore = getHighTiebreakValue({ lowValue: lowTiebreakScore, tiebreakTo, NoAD });
      if (leadingSide === 1) {
        set.side1TiebreakScore = highTiebreakScore;
        set.side2TiebreakScore = lowTiebreakScore;
      } else {
        set.side1TiebreakScore = lowTiebreakScore;
        set.side2TiebreakScore = highTiebreakScore;
      }
    }

    score = (matchUp.score || '') + close;
    if (!analysis.isDecidingSet) score += SPACE_CHARACTER;

    const winningSide = getWinningSide({ analysis, set });
    set.winningSide = winningSide || undefined;

    updated = true;
  } else if (analysis.isTiebreakSetValue) {
    ({ message, score, sets, updated } = processTiebreakSet({ analysis, auto, lowSide, score, sets, value }));
  } else if (analysis.isSetTiebreakEntry) {
    const [open] = SET_TIEBREAK_BRACKETS.split('');
    const lastOpenBracketIndex = Math.max(...indices(open, score.split('')));
    const tiebreakValue = score.slice(lastOpenBracketIndex + 1);
    const hasZeroStart = tiebreakValue && parseInt(tiebreakValue) === ZERO;
    const newTiebreakValue = parseInt(tiebreakValue ? tiebreakValue + value : value);

    const { tiebreakFormat } = analysis.setFormat;
    const { tiebreakTo, NoAD } = tiebreakFormat || {};

    if (!hasZeroStart && tiebreakValue.length < 2) {
      if (NoAD && newTiebreakValue > tiebreakTo - 1) {
        message = 'invalid low value for NoAD tiebreak';
      } else {
        updated = true;
        score = (matchUp.score || '') + value;
      }
    } else {
      message = hasZeroStart ? 'tiebreak begins with zero' : 'tiebreak digit limit';
    }
  } else if (analysis.isCloser) {
    message = `invalid key: ${value}`;
  } else if (analysis.isGameScoreEntry) {
    message = 'game score entry';
  } else {
    if (analysis.lastSetIsComplete || !sets.length) {
      updated = true;
      const { score: newScore, set } = calcSetScore({ analysis, lowSide, matchUp, value: parseInt(value) });
      if (set) set.setNumber = sets?.length + 1 || 1;
      sets = sets?.concat(set).filter((f) => f) || [set];
      score = newScore || undefined;
    } else {
      console.log('error: unknown outcome');
    }
  }

  if (updated) {
    sets = sets?.filter((f) => f);
    const updatedMatchUp = Object.assign(matchUp, { sets, score, matchUpFormat });
    const { matchUpWinningSide } = getMatchUpWinner({ analysis, matchUp: updatedMatchUp });
    const updatedTime = new Date().getTime();
    Object.assign(updatedMatchUp, { winningSide: matchUpWinningSide, updated: updatedTime });
    if (matchUpWinningSide && (!updatedMatchUp.matchUpStatus || updatedMatchUp.matchUpStatus === 'TO_BE_PLAYED')) {
      updatedMatchUp.matchUpStatus = OUTCOME_COMPLETE;
      updatedMatchUp.sets = updatedMatchUp.sets.filter((set) => {
        const { side1Score, side2Score, side1TiebreakScore, side2TiebreakScore } = set;
        return side1Score || side2Score || side1TiebreakScore || side2TiebreakScore;
      });
    } else if (
      updatedMatchUp.score &&
      !updatedMatchUp.winningSide &&
      ![STATUS_SUSPENDED, STATUS_ABANDONED, STATUS_INTERRUPTED].includes(updatedMatchUp.matchUpStatus)
    ) {
      updatedMatchUp.matchUpStatus = undefined;
    }
    return { matchUp: updatedMatchUp, updated, message };
  }

  return { matchUp, updated, message };
}
