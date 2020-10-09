import { ScoringMatchUpInterface, SetWinnerEnum } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import { ParticipantInterface } from 'components/dialogs/scoringDialog/typedefs/participantTypes';
import { ScoringDetailsInterface, SetResultInterface } from 'typedefs/store/tmxTypes';

export const getExistingScoreFromMatch = (matchUp: ScoringMatchUpInterface) => {
  return matchUp.sets
    .filter((set) => set.side1 || set.side2)
    .map((set) => {
      const side1: SetResultInterface = { games: parseInt(set.side1) };
      const side2: SetResultInterface = { games: parseInt(set.side2) };
      if (set?.tiebreak?.side1 || set?.tiebreak?.side2) {
        const side1Spacer = set.tiebreak.side1 > set.tiebreak.side2;
        if (set.winner || set.winner !== SetWinnerEnum.NONE) {
          if (side1Spacer) {
            side1.spacer = parseInt(set?.tiebreak?.side1);
            side2.tiebreak = parseInt(set?.tiebreak?.side2);
          } else {
            side2.spacer = parseInt(set?.tiebreak?.side2);
            side1.tiebreak = parseInt(set?.tiebreak?.side1);
          }
        } else {
          side1.tiebreak = parseInt(set?.tiebreak?.side1 || '0');
          side2.tiebreak = parseInt(set?.tiebreak?.side2 || '0');
          side1.isRetiredInTiebreak = matchUp.status.side1.categoryName === 'Retirements';
          side2.isRetiredInTiebreak = matchUp.status.side2.categoryName === 'Retirements';
        }
      }
      if (set.isTiebreakSet) {
        side1.supertiebreak = true;
        side2.supertiebreak = true;
      }
      if (set.gameResult) {
        side1.gamePoints = set.gameResult.side1;
        side2.gamePoints = set.gameResult.side2;
      }
      return [side1, side2];
    });
};

/**
 * The method is the same logic from previous Scoring Dialog but with adjusted data
 * @param matchUp
 * @param winningSide
 */
export const getScore = (matchUp: ScoringMatchUpInterface, winningSide: any) => {
  const existingScores = getExistingScoreFromMatch(matchUp);
  const existingScoresIfUndefined = existingScores[0] === undefined ? [] : existingScores;

  const winner = (winningSide && winningSide - 1) || 0;
  const loser = 1 - winner;
  // create string score which is expected if there's an existing score which is not empty
  let score =
    existingScoresIfUndefined.length > 0
      ? existingScoresIfUndefined
          .map((currentSet) => {
            if (currentSet[winner].supertiebreak) {
              return `[${currentSet[winner].games}-${currentSet[loser].games}]`;
            }
            const t1 = currentSet[winner]?.tiebreak;
            const t2 = currentSet[loser]?.tiebreak;
            const tiebreak =
              t1 !== undefined || t2 !== undefined ? `(${[t1, t2].filter((f) => f >= 0).join('-')})` : '';
            return `${currentSet[winner].games}-${currentSet[loser].games}${tiebreak}`;
          })
          .join(' ')
      : '';

  const side1StatusCategoryName = matchUp.status.side1.categoryName;
  const side2StatusCategoryName = matchUp.status.side2.categoryName;
  const side1StatusSubCategoryName = matchUp.status.side1.subCategoryName;
  const side2StatusSubCategoryName = matchUp.status.side2.subCategoryName;

  // TODO: after more information, add suffixes to scores accordingly
  if (side1StatusCategoryName === 'Retirements' || side2StatusCategoryName === 'Retirements') score += ' RET';
  // if (msh === MatchParticipantStatusEnum.TIME || msa === MatchParticipantStatusEnum.TIME) score += ' TIME';
  if (side1StatusCategoryName === 'Walkovers' || side2StatusCategoryName === 'Walkovers') score = 'WO';
  if (side1StatusCategoryName === 'Defaults' || side2StatusCategoryName === 'Defaults') score += ' DEF';
  if (side1StatusSubCategoryName === 'Cancelled match' || side2StatusSubCategoryName === 'Cancelled match') {
    score = 'Cancelled';
  }
  if (side1StatusSubCategoryName === 'Abandoned match' || side2StatusSubCategoryName === 'Abandoned match') {
    score = 'ABN';
  }
  if (side1StatusSubCategoryName === 'Incomplete match' || side2StatusSubCategoryName === 'Incomplete match') {
    score += ' INT';
  }
  return score;
};

export const getTeamOneTwo = (scoringDetails: ScoringDetailsInterface) => {
  const teamOne = scoringDetails?.teams[0].map<ParticipantInterface>((participant) => ({
    id: participant.id,
    firstName: participant.first_name,
    lastName: participant.last_name
  }));
  const teamTwo = scoringDetails?.teams[1].map<ParticipantInterface>((participant) => ({
    id: participant.id,
    firstName: participant.first_name,
    lastName: participant.last_name
  }));
  return [teamOne, teamTwo];
};
