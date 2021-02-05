import { drawDefinitionConstants, policyConstants } from 'tods-competition-factory';

const { MAIN, QUALIFYING, CONSOLATION, PLAY_OFF } = drawDefinitionConstants;
const { POLICY_TYPE_ROUND_NAMING } = policyConstants;

export const ROUND_NAMING_DEFAULT = {
  [POLICY_TYPE_ROUND_NAMING]: {
    policyName: 'Round Naming Default',
    roundNamingMap: {
      '1': 'Final',
      '2': 'Semifinals',
      '4': 'Quarterfinals'
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
