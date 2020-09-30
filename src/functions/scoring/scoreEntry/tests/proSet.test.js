import { singleSetStressTests } from 'functions/scoring/scoreEntry/tests/standardStress';
import { FORMAT_PRO_SET } from 'functions/scoring/scoreEntry/tests/formatConstants';
import { scoreMatchUp, enterValues } from './primitives';

singleSetStressTests({matchUpFormat: FORMAT_PRO_SET, setTo: 8 });

it('generates appropriate high score', () => {
  let message, matchUpFormat = FORMAT_PRO_SET;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const values = [
    { lowSide: 2, value: '3' },
  ];

  ({ matchUp } = enterValues({values, matchUp}));
  expect(matchUp.score.trim()).toEqual(`8-3`);
  expect(matchUp.sets.length).toEqual(1);
  expect(matchUp.winningSide).toEqual(1);

  ({ matchUp, message } = scoreMatchUp({ value: 'backspace', matchUp}));
  ({ matchUp, message } = scoreMatchUp({ lowSide: 2, value: '2', matchUp}));
  expect(matchUp.score.trim()).toEqual(`8-2`);
  expect(matchUp.sets.length).toEqual(1);
  expect(matchUp.winningSide).toEqual(1);
});

it('generates appropriate high score with win by 2', () => {
  let message, matchUpFormat = FORMAT_PRO_SET;
  let matchUp = { score: undefined, sets: [], matchUpFormat };

  const values = [
    { lowSide: 2, value: '7' },
  ];

  ({ matchUp } = enterValues({values, matchUp}));
  expect(matchUp.score.trim()).toEqual(`9-7`);
  expect(matchUp.sets.length).toEqual(1);
  expect(matchUp.winningSide).toEqual(1);

  ({ matchUp, message } = scoreMatchUp({ value: 'backspace', matchUp}));
  ({ matchUp, message } = scoreMatchUp({ lowSide: 2, value: '8', matchUp}));
  expect(matchUp.score.trim()).toEqual(`9-8(`);
  expect(matchUp.sets.length).toEqual(1);
  expect(matchUp.winningSide).toBeUndefined();
});
