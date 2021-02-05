import { MatchParticipantStatusCategory } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';

export const statusCategories: MatchParticipantStatusCategory[] = [
  {
    label: 'None',
    subCategories: [
      {
        label: 'None',
        description: 'None',
        matchUpStatusCodeDisplay: 'None',
        matchUpStatusCode: ''
      }
    ]
  },
  {
    label: 'Winner',
    subCategories: [
      {
        label: 'Winner',
        description: 'Winner',
        matchUpStatusCodeDisplay: 'Winner',
        matchUpStatusCode: ''
      }
    ],
    hidden: true
  },
  {
    label: 'Walkovers',
    subCategories: [
      {
        label: 'Injury',
        description: 'Injury',
        matchUpStatusCodeDisplay: 'Wo [inj]',
        matchUpStatusCode: 'W1'
      },
      {
        label: 'Illness',
        description: 'Illness',
        matchUpStatusCodeDisplay: 'Wo [ill]',
        matchUpStatusCode: 'W2'
      },
      {
        label: 'Personal circumstance',
        description: 'Personal circumstance',
        matchUpStatusCodeDisplay: 'Wo [pc]',
        matchUpStatusCode: 'W3'
      },
      {
        label: 'Double walkover',
        description: 'Double walkover',
        matchUpStatusCodeDisplay: 'Wo/Wo',
        matchUpStatusCode: 'W4'
      }
    ]
  },
  {
    label: 'Defaults',
    subCategories: [
      {
        label: 'Disqualification for cause or ineligibility',
        description: 'Disqualification (ineligibility)',
        matchUpStatusCodeDisplay: 'Def [dq]',
        matchUpStatusCode: 'DQ'
      },
      {
        label: 'Misconduct before or between matches',
        description: 'Misconduct',
        matchUpStatusCodeDisplay: 'Def [cond]',
        matchUpStatusCode: 'DM'
      },
      {
        label: 'Failure to start match because of adult discipline',
        description: 'Fail. (adult discipline)',
        matchUpStatusCodeDisplay: 'Def [ad]',
        matchUpStatusCode: 'D5'
      },
      {
        label:
          'Refusal to start match for reason other than adult discipline, injury, illness, or personal circumstance. ' +
          '(After the Referee has conclusively confirmed that a player refuses to play a match, the Referee need not ' +
          'wait until the scheduled time of the match to records the result.)',
        description: 'Refusal to start match',
        matchUpStatusCodeDisplay: 'Def [refsl]',
        matchUpStatusCode: 'D4'
      },
      {
        label: 'Not showing up',
        description: 'Not showing up',
        matchUpStatusCodeDisplay: 'Def [ns]',
        matchUpStatusCode: 'D6'
      },
      {
        label:
          'Lateness for match including, but not limited to, intending to play but mistakenly arriving at the ' +
          'wrong time, location, or without proper equipment',
        description: 'Lateness for match',
        matchUpStatusCodeDisplay: 'Score + Def [late]',
        matchUpStatusCode: 'D7'
      },
      {
        label: 'Double default',
        description: 'Double default',
        matchUpStatusCodeDisplay: 'Def/Def',
        matchUpStatusCode: 'DD'
      },
      {
        label:
          'Refusal to continue playing a match for reason other than injury, illness, personal circumstance, or ' +
          'adult discipline',
        description: 'Refusal to continue match',
        matchUpStatusCodeDisplay: 'Def [refsl]',
        matchUpStatusCode: 'D9'
      },
      {
        label: 'Default for receiving an injection, IV, or supplemental oxygen',
        description: 'Default (PEDs)',
        matchUpStatusCodeDisplay: 'Def [med]',
        matchUpStatusCode: 'DI'
      },
      {
        label: 'Default under Point Penalty System',
        description: 'Default (Point Penalty System)',
        matchUpStatusCodeDisplay: 'Score + Def [pps]',
        matchUpStatusCode: 'DP'
      }
    ]
  },
  {
    label: 'Retirements',
    subCategories: [
      {
        label: 'Injury',
        description: 'Injury',
        matchUpStatusCodeDisplay: 'Score + Ret [inj]',
        matchUpStatusCode: 'RJ'
      },
      {
        label: 'Illness',
        description: 'Illness',
        matchUpStatusCodeDisplay: 'Score + Ret [ill]',
        matchUpStatusCode: 'RI'
      },
      {
        label: 'Personal circumstance',
        description: 'Personal circumstance',
        matchUpStatusCodeDisplay: 'Score + Ret [pc]',
        matchUpStatusCode: 'RC'
      },
      {
        label: 'Retirement because of adult discipline',
        description: 'Ret. (adult discipline)',
        matchUpStatusCodeDisplay: 'Score + Ret [ad]',
        matchUpStatusCode: 'RD'
      },
      {
        label:
          'A player who retires from a match remains eligible for consolations, place playoffs, doubles and ' +
          'subsequent round robin matches',
        description: 'Ret. (eligible)',
        matchUpStatusCodeDisplay: 'Unknown',
        matchUpStatusCode: 'RU'
      }
    ]
  },
  {
    label: 'Other',
    subCategories: [
      {
        label: 'Incomplete match',
        description: 'Incomplete match',
        matchUpStatusCodeDisplay: 'Incomplete',
        matchUpStatusCode: 'OI'
      },
      {
        label: 'Abandoned match',
        description: 'Abandoned match',
        matchUpStatusCodeDisplay: 'Abandoned',
        matchUpStatusCode: 'OA'
      },
      {
        label: 'Cancelled match',
        description: 'Cancelled match',
        matchUpStatusCodeDisplay: 'Unplayed or Cancelled',
        matchUpStatusCode: 'OC'
      }
    ]
  }
];
