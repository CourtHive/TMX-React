import { drawDefinitionConstants, policyConstants } from 'tods-competition-factory';

export const defaultMatchUpFormatKey = 's3';

const { MAIN } = drawDefinitionConstants;
const { POLICY_TYPE_SCORING } = policyConstants;
const scoreFormatTypes = {
  STANDARD: 'STANDARD',
  SHORT: 'SHORT',
  PRO: 'PRO',
  TIEBREAK: 'TIEBREAK',
  TIMED: 'TIMED'
};

/*
 * Follows the format for Competition Factory scoring policies.
 */
export const SCORING_DEFAULT = {
  [POLICY_TYPE_SCORING]: {
    requireAllPositionsAssigned: false,
    stage: {
      [MAIN]: {
        stageSequence: {
          1: {
            requireAllPositionsAssigned: true
          }
        }
      }
    },
    defaultMatchUpFormat: 'SET3-S:6/TB7',
    matchUpFormats: [
      {
        key: 's3',
        name: 'Best of 3 tiebreak sets',
        format: 'SET3-S:6/TB7',
        type: scoreFormatTypes.STANDARD
      },
      {
        key: 's2mtb7',
        name: 'Two tiebreak sets, 7-point match tiebreak at one set all',
        format: 'SET3-S:6/TB7-F:TB7',
        type: scoreFormatTypes.STANDARD
      },
      {
        key: 's2mtb10',
        name: 'Two tiebreak sets, 10-point match tiebreak at one set all',
        format: 'SET3-S:6/TB7-F:TB10',
        type: scoreFormatTypes.STANDARD
      },
      {
        key: 's1',
        name: 'One standard tiebreak set to 6, 7-point tiebreak at 6 games all',
        format: 'SET1-S:6/TB7',
        type: scoreFormatTypes.STANDARD
      },
      {
        key: 's1to4',
        name: 'Best of 3 sets to 4',
        format: 'SET3-S:4/TB7',
        type: scoreFormatTypes.STANDARD
      },
      {
        key: 'short1',
        name: 'Two out of three short sets to 4 with 5-point tiebreak at 3 games all',
        format: 'SET3-S:4/TB5@3',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'short2',
        name: 'One short set to 4, 7-point tiebreak at 4 games all',
        format: 'SET1-S:4/TB7',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'short3',
        name: 'One short set to 4, 5-point tiebreak at 3 games all',
        format: 'SET1-S:4/TB5@3',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'short4',
        name: 'Two short sets to 4, 10-point match tiebreak at one set all',
        format: 'SET3-S:4/TB7-F:TB10',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'short5',
        name: 'Two short sets to 4, 7-point match tiebreak at one set all',
        format: 'SET3-S:4/TB7-F:TB7',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'short6',
        name: 'One no advantage set to 5, tiebreak to 9 at 4-4',
        format: 'SET1-S:5NOAD/TB9@4',
        type: scoreFormatTypes.SHORT
      },
      {
        key: 'pro',
        name: '8 game pro-set with 7 point tiebreak at 8 games all',
        format: 'SET1-S:8/TB7',
        type: scoreFormatTypes.PRO
      },
      {
        key: 'collegePro',
        name: '8 game pro-set with 7 point tiebreak at 7 games all',
        format: 'SET1-S:8/TB7@7',
        type: scoreFormatTypes.PRO
      },
      {
        key: 'tbsets2',
        name: 'Best of 3 10-point tiebreak games',
        format: 'SET3-S:TB10',
        type: scoreFormatTypes.TIEBREAK
      },
      {
        key: 'tbsets3',
        name: 'One 10-point tiebreak game',
        format: 'SET1-S:TB10',
        type: scoreFormatTypes.TIEBREAK
      },
      {
        key: 'timed20',
        name: 'Timed 20 minute game - game based',
        format: 'SET1-S:T20',
        type: scoreFormatTypes.TIMED
      }
    ]
  }
};
