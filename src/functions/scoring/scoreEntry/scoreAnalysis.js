import { indices } from 'functions/arrays';
import { matchUpFormatCode } from 'tods-matchup-format-code';
import { testTiebreakEntry } from 'functions/scoring/scoreEntry/scoreUtilities';
import { checkValidMatchTiebreak } from 'functions/scoring/scoreEntry/scoreUtilities';

import {
  SCORE_JOINER,
  MATCH_TIEBREAK_JOINER,
  OPENERS,
  CLOSERS,
  OUTCOMES,
  SPACE_KEY,
  SET_TIEBREAK_BRACKETS,
  MATCH_TIEBREAK_BRACKETS
} from 'functions/scoring/scoreEntry/constants';

export function getScoreAnalysis({ sets, score, matchUp, matchUpFormat, value }) {
  const completedSets = matchUp.sets?.filter((set) => set?.winningSide)?.length || 0;
  const hasWinningSide = matchUp.winningSide;
  const setNumber = completedSets + (hasWinningSide ? 0 : 1);

  const matchUpScoringFormat = matchUpFormatCode.parse(matchUpFormat);
  const isDecidingSet = setNumber === matchUpScoringFormat?.bestOf;
  const setFormat = (isDecidingSet && matchUpScoringFormat.finalSetFormat) || matchUpScoringFormat.setFormat || {};
  const isTimedSet = setFormat?.timed || matchUpScoringFormat.timed;

  const finalSet = isDecidingSet && matchUp.sets[matchUpScoringFormat?.bestOf - 1];
  const finalSetIsComplete = finalSet && finalSet.winningSide;

  const { isTiebreakEntry: isSetTiebreakEntry } = testTiebreakEntry({ score, brackets: SET_TIEBREAK_BRACKETS });
  const { isTiebreakEntry: isMatchTiebreakEntry } = testTiebreakEntry({ score, brackets: MATCH_TIEBREAK_BRACKETS });
  const isTiebreakEntry = isSetTiebreakEntry || isMatchTiebreakEntry;

  const isTiebreakSet = !!setFormat.tiebreakSet;
  const lastScoreChar = score && score[score.length - 1].trim();
  const isNumericEnding = score && !isNaN(lastScoreChar);

  const isIncompleteSetScore = !isTiebreakEntry && lastScoreChar === SCORE_JOINER;
  const isIncompleteSetTiebreak = isSetTiebreakEntry && OPENERS.includes(lastScoreChar);
  const isIncompleteMatchTiebreak = isMatchTiebreakEntry && OPENERS.includes(lastScoreChar);
  const isPartialMatchTiebreakValue = isMatchTiebreakEntry && lastScoreChar === MATCH_TIEBREAK_JOINER;

  const splitScore = score && score.split('');
  const [open] = MATCH_TIEBREAK_BRACKETS.split('');
  const lastOpenBracketIndex = splitScore && Math.max(...indices(open, splitScore));
  const lastJoinerIndex = splitScore && Math.max(...indices(MATCH_TIEBREAK_JOINER, splitScore));
  const matchTiebreakHasJoiner = splitScore && lastJoinerIndex > lastOpenBracketIndex;

  const lastSetIsComplete = sets[sets.length - 1]?.winningSide;
  const isGameScoreEntry = sets?.length && !lastSetIsComplete;

  const hasOutcome = OUTCOMES.find((outcome) => matchUp?.score?.indexOf(outcome) >= 0);

  const isNumericValue = !isNaN(value);

  const isSpace = value === SPACE_KEY;
  const isCloser = CLOSERS.includes(value);
  const hasOpener = matchUp?.score?.split('').find((char) => OPENERS.includes(char));

  const isInvalidMatchTiebreakValue =
    isCloser &&
    isMatchTiebreakEntry &&
    !isIncompleteMatchTiebreak &&
    (isPartialMatchTiebreakValue || !checkValidMatchTiebreak({ score }));

  const isInvalidSetTiebreakValue = isSpace && isTiebreakEntry && isIncompleteSetTiebreak;
  const isTiebreakCloser = isCloser && hasOpener && isTiebreakEntry && isNumericEnding;
  const isTiebreakSetValue = isTiebreakSet && isNumericValue;

  return {
    isTiebreakSetValue,
    matchUpScoringFormat,
    setNumber,
    setFormat,
    matchTiebreakHasJoiner,
    isGameScoreEntry,
    isSpace,
    isCloser,
    isTiebreakCloser,
    isDecidingSet,
    isTiebreakSet,
    isTimedSet,
    isNumericEnding,
    isNumericValue,
    hasOpener,
    hasOutcome,
    hasWinningSide,
    finalSet,
    finalSetIsComplete,
    lastSetIsComplete,
    isInvalidSetTiebreakValue,
    isInvalidMatchTiebreakValue,
    isTiebreakEntry,
    isSetTiebreakEntry,
    isMatchTiebreakEntry,

    isIncompleteSetScore,
    isIncompleteSetTiebreak,
    isIncompleteMatchTiebreak,
    isPartialMatchTiebreakValue
  };
}
