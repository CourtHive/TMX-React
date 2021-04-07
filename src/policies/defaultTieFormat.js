import { utilities } from 'tods-competition-factory';

export function defaultTieFormat() {
  return {
    collectionDefinitions: [
      {
        matchUpsCount: 3,
        collectionName: 'DOUBLES',
        collectionId: utilities.UUID(),
        collectionValue: 1.5,
        matchUpValue: 0.5
      },
      {
        matchUpsCount: 6,
        collectionName: 'SINGLES',
        collectionId: utilities.UUID(),
        collectionValue: 6,
        matchUpValue: 1
      }
    ],
    winCriteria: {
      valueGoal: 4
    }
  };
}
