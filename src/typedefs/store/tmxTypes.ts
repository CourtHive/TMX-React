// TODO: add missing types
import { MatchParticipantStatus } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import { MatchUpInterface } from 'typedefs/store/scheduleTypes';

export interface TmxInterface {
  actionData: ActionDataInterface;
}
// TODO: missing types here, check the scoringDetails -> teams array for more info
export interface TeamInterface {
  draw_position: number;
  first_name: string;
  full_name: string;
  id: string;
  ioc: string;
  last_name: string;
  rankings: any; // TODO: update when find out what type it is
  sex: string;
}
export interface SetResultInterface {
  games?: number;
  gamePoints?: string;
  spacer?: number;
  tiebreak?: number;
  supertiebreak?: boolean;
  isRetiredInTiebreak?: boolean;
}

export interface PersonInterface {
  personId: string;
  nationalityCode: string;
  standardFamilyName: string;
  standardGivenName: string;
  sex?: string;
}

export interface onlineProfile {
  type: string;
  identifier: string;
}
export interface ParticipantInterface {
  name?: string;
  participantId?: string;
  participantType?: string;
  individualParticipants?: Array<ParticipantInterface>;
  onlineProfiles?: onlineProfile[];
  person?: PersonInterface;
}

export interface SideInterface {
  participant: ParticipantInterface;
  participantId: string;
  seedNumber?: number;
  seedValue?: number;
  sideNumber: number;
}

// TODO: this interface is outdated
export interface ScoringDetailsInterface {
  matchUp?: MatchUpInterface;
  callback: Function;
  flags?: string;
  delegation: boolean;
  existing_scores: Array<SetResultInterface>[];
  matchUpFormat: string;
  muid: string;
  roundName: string;
  status: string;
  statusObject: ScoreOutcomeStatusInterface;
  teams: Array<TeamInterface>[];
}

// TODO: introduce proper types
export interface ActionDataInterface {
  autoDraw?: any;
  scoringDetails?: ScoringDetailsInterface;
  swapDrawPosition?: any;
}

export interface ScoreOutcomeStatusInterface {
  sideOne: MatchParticipantStatus;
  sideTwo: MatchParticipantStatus;
}

export interface ScoreOutcomeInterface {
  complete: boolean;
  matchUpFormat: string;
  matchId: string;
  position: number;
  positions: number[];
  score: string;
  set_scores: Array<SetResultInterface>[];
  statusObject: ScoreOutcomeStatusInterface;
  teams: Array<TeamInterface>[];
  winner: number;
}

export interface SaveScorePayloadInterface {
  drawId: number;
  existingScores: Array<SetResultInterface>[];
  matchId: string;
  outcome: ScoreOutcomeInterface;
}
