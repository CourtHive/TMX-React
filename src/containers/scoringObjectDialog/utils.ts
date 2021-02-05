import { ScoringMatchUpInterface } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';

export const getScore = (matchUp: ScoringMatchUpInterface) => {
  const setResults = matchUp.sets.map((set) => {
    const resultSet = {} as any;
    if (set?.side1 || set?.side2) {
      resultSet.side1Score = parseInt(set.side1);
      resultSet.side2Score = parseInt(set.side2);
    }
    if (set?.tiebreak?.side1 || set?.tiebreak?.side2) {
      resultSet.side1TiebreakScore = parseInt(set?.tiebreak?.side1);
      resultSet.side1TiebreakScore = parseInt(set?.tiebreak?.side2);
    }
    if (set.gameResult) {
      resultSet.games = {
        points: set.gameResult.side1,
        winningSide: set.gameResult.side1 > set.gameResult.side2 ? 1 : 2
      };
    }
    return resultSet;
  });

  return {
    scoreStringSide1: setResults.reduce((set) => `${set.side1Score}-${set.side2Score} `, '').slice(0, -1),
    scoreStringSide2: setResults.reduce((set) => `${set.side2Score}-${set.side1Score} `, '').slice(0, -1)
  };
};

export const TODSsets = (sets) =>
  sets.map((set) => {
    const s1tb = parseInt(set.isTiebreakSet ? set.side1 : set.tiebreak?.side1);
    const s2tb = parseInt(set.isTiebreakSet ? set.side2 : set.tiebreak?.side2);
    const side1TiebreakScore = !isNaN(s1tb) ? s1tb : undefined;
    const side2TiebreakScore = !isNaN(s2tb) ? s2tb : undefined;
    return {
      setNumber: set.setNumber,
      side1Score: set.isTiebreakSet ? undefined : set.side1 ? parseInt(set.side1) : undefined,
      side2Score: set.isTiebreakSet ? undefined : set.side2 ? parseInt(set.side2) : undefined,
      side1TiebreakScore,
      side2TiebreakScore,
      winningSide: set.winner === 'SIDE1' ? 1 : set.winner === 'SIDE2' ? 2 : undefined
    };
  });
