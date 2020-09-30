import { FORMAT_ATP_DOUBLES } from 'functions/scoring/scoreEntry/tests/formatConstants';
import { MATCH_TIEBREAK_JOINER} from 'functions/scoring/scoreEntry/constants';
import { TIEBREAK_CLOSER, scoreMatchUp, enterValues } from './primitives';

it('recognizes incomplete match tiebreaks', () => {
  let message, matchUpFormat = FORMAT_ATP_DOUBLES;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const v1 = [
    { lowSide: 2, value: 3 },
    { lowSide: 1, value: 3 },
    { lowSide: 2, value: 3 },
  ];

  ({ matchUp } = enterValues({values: v1, matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10${MATCH_TIEBREAK_JOINER}3`);
  expect(matchUp.sets.length).toEqual(3);

  ({ matchUp } = scoreMatchUp({value: 'backspace', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10`);
  expect(matchUp.sets.length).toEqual(3);

  // not valid to complete score
  ({ matchUp, message } = scoreMatchUp({value: ']', matchUp}));
  expect(message).not.toBeUndefined();
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10`);

  ({ matchUp } = scoreMatchUp({value: 'backspace', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [1`);
  expect(matchUp.sets.length).toEqual(3);

  // not valid to complete score
  ({ matchUp, message } = scoreMatchUp({value: ']', matchUp}));
  expect(message).not.toBeUndefined();
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [1`);

  ({ matchUp, message } = scoreMatchUp({value: '1', lowSide: 1, matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [11${MATCH_TIEBREAK_JOINER}13`);

  ({ matchUp, message } = scoreMatchUp({value: ']', matchUp}));
  expect(matchUp.winningSide).toEqual(2);
});

it('can support 2nd set tiebreaks with 3rd set match tiebreaks', () => {
  let message, matchUpFormat = FORMAT_ATP_DOUBLES;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const v1 = [
    { lowSide: 2, value: '3' },
    { lowSide: 1, value: '6' },
    { lowSide: 2, value: '2' },
    TIEBREAK_CLOSER,
  ];

  ({ matchUp } = enterValues({values: v1, matchUp}));
  expect(matchUp.score.trim()).toEqual('6-3 6-7(2)');
  expect(matchUp.sets.length).toEqual(2);

  ({ matchUp, message } = scoreMatchUp({ lowSide: 2, value: '3', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 6-7(2) [10${MATCH_TIEBREAK_JOINER}3`);
  expect(matchUp.sets.length).toEqual(3);
  expect(matchUp.winningSide).toBeUndefined();

  ({ matchUp, message } = scoreMatchUp({ value: ']', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 6-7(2) [10${MATCH_TIEBREAK_JOINER}3]`);
  expect(matchUp.winningSide).toEqual(1);
});

it('does not allow match tiebreak scores greater than 2 digits', () => {
  let message, matchUpFormat = FORMAT_ATP_DOUBLES;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const values = [
    { lowSide: 2, value: '3' },
    { lowSide: 1, value: '3' },
    { lowSide: 2, value: '3' },
  ];

  ({ matchUp } = enterValues({values, matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10${MATCH_TIEBREAK_JOINER}3`);
  expect(matchUp.sets.length).toEqual(3);
  expect(matchUp.winningSide).toBeUndefined();

  ({ matchUp, message } = scoreMatchUp({ lowSide: 1, value: '1', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10${MATCH_TIEBREAK_JOINER}3`);
  expect(matchUp.winningSide).toBeUndefined();
});

it('can enter 0 for side 2 when match tiebreak open bracket and no match tiebreak score', () => {
  let message, matchUpFormat = FORMAT_ATP_DOUBLES;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const values = [
    { lowSide: 2, value: '3' },
    { lowSide: 1, value: '3' },
    { lowSide: 2, value: '3' },
    { value: 'backspace' },
    { value: 'backspace' },
    { value: 'backspace' },
  ];

  ({ matchUp } = enterValues({values, matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6`);
  expect(matchUp.sets.length).toEqual(2);
  expect(matchUp.winningSide).toBeUndefined();

  ({ matchUp, message } = scoreMatchUp({ lowSide: 2, value: '0', matchUp}));
  expect(matchUp.score.trim()).toEqual(`6-3 3-6 [10${MATCH_TIEBREAK_JOINER}0`);
  expect(matchUp.winningSide).toBeUndefined();
});
