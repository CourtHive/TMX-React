import { MatchParticipantStatusCategory } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';

export const statusCategories: MatchParticipantStatusCategory[] = [
  {
    label: 'None',
    subCategories: [
      {
        label: 'None',
        description: 'None',
        tdmCode: 'None'
      }
    ]
  },
  {
    label: 'Winner',
    subCategories: [
      {
        label: 'Winner',
        description: 'Winner',
        tdmCode: 'Winner'
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
        tdmCode: 'Wo [inj]'
      },
      {
        label: 'Illness',
        description: 'Illness',
        tdmCode: 'Wo [ill]'
      },
      {
        label: 'Personal circumstance',
        description: 'Personal circumstance',
        tdmCode: 'Wo [pc]'
      },
      {
        label: 'Double walkover',
        description: 'Double walkover',
        tdmCode: 'Wo/Wo'
      }
    ]
  },
  {
    label: 'Defaults',
    subCategories: [
      {
        label: 'Disqualification for cause or ineligibility',
        description: 'Disqualification (ineligibility)',
        tdmCode: 'Def [dq]'
      },
      {
        label: 'Misconduct before or between matches',
        description: 'Misconduct',
        tdmCode: 'Def [cond]'
      },
      {
        label: 'Failure to start match because of adult discipline',
        description: 'Fail. (adult discipline)',
        tdmCode: 'Def [ad]'
      },
      {
        label:
          'Refusal to start match for reason other than adult discipline, injury, illness, or personal circumstance. ' +
          '(After the Referee has conclusively confirmed that a player refuses to play a match, the Referee need not ' +
          'wait until the scheduled time of the match to records the result.)',
        description: 'Refusal to start match',
        tdmCode: 'Def [refsl]'
      },
      {
        label: 'Not showing up',
        description: 'Not showing up',
        tdmCode: 'Def [ns]'
      },
      {
        label:
          'Lateness for match including, but not limited to, intending to play but mistakenly arriving at the ' +
          'wrong time, location, or without proper equipment',
        description: 'Lateness for match',
        tdmCode: 'Score + Def [late]'
      },
      {
        label: 'Double default',
        description: 'Double default',
        tdmCode: 'Def/Def'
      },
      {
        label:
          'Refusal to continue playing a match for reason other than injury, illness, personal circumstance, or ' +
          'adult discipline',
        description: 'Refusal to continue match',
        tdmCode: 'Def [refsl]'
      },
      {
        label: 'Default for receiving an injection, IV, or supplemental oxygen',
        description: 'Default (PEDs)',
        tdmCode: 'Def [med]'
      },
      {
        label: 'Default under Point Penalty System',
        description: 'Default (Point Penalty System)',
        tdmCode: 'Score + Def [pps]'
      }
    ]
  },
  {
    label: 'Retirements',
    subCategories: [
      {
        label: 'Injury',
        description: 'Injury',
        tdmCode: 'Score + Ret [inj]'
      },
      {
        label: 'Illness',
        description: 'Illness',
        tdmCode: 'Score + Ret [ill]'
      },
      {
        label: 'Personal circumstance',
        description: 'Personal circumstance',
        tdmCode: 'Score + Ret [pc]'
      },
      {
        label: 'Retirement because of adult discipline',
        description: 'Ret. (adult discipline)',
        tdmCode: 'Score + Ret [ad]'
      },
      {
        label:
          'A player who retires from a match remains eligible for consolations, place playoffs, doubles and ' +
          'subsequent round robin matches',
        description: 'Ret. (eligible)',
        tdmCode: 'Unknown'
      }
    ]
  },
  {
    label: 'Other',
    subCategories: [
      {
        label: 'Incomplete match',
        description: 'Incomplete match',
        tdmCode: 'Incomplete'
      },
      {
        label: 'Abandoned match',
        description: 'Abandoned match',
        tdmCode: 'Abandoned'
      },
      {
        label: 'Cancelled match',
        description: 'Cancelled match',
        tdmCode: 'Unplayed or Cancelled'
      }
    ]
  }
];
