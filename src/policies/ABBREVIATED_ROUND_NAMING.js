import { drawDefinitionConstants, policyConstants } from 'tods-competition-factory';

const { MAIN, QUALIFYING, CONSOLATION, PLAY_OFF } = drawDefinitionConstants;
const { POLICY_TYPE_ROUND_NAMING } = policyConstants;

export const ABBREVIATED_ROUND_NAMING = {
  [POLICY_TYPE_ROUND_NAMING]: {
    policyName: 'Round Naming Default',
    roundNamingMap: {
      '1': 'F',
      '2': 'SF',
      '4': 'QF'
    },
    affixes: {
      roundNumber: 'R',
      preFeedRound: 'Q'
    },
    stageConstants: {
      [MAIN]: '',
      [QUALIFYING]: 'Q',
      [CONSOLATION]: 'C',
      [PLAY_OFF]: 'PL'
    }
  }
};
