import { ParticipantInterface } from 'components/dialogs/scoringObjectDialog/typedefs/participantTypes';

export interface TiebreakFormatInterface {
  NoAD?: boolean;
  tiebreakTo: number;
}

export interface SetFormatInterface {
  setTo: number;
  NoAD?: boolean;
  timed?: boolean;
  minutes?: number;
  noTiebreak?: boolean;
  tiebreakAt?: number;
  tiebreakFormat?: TiebreakFormatInterface;
  tiebreakSet?: TiebreakFormatInterface;
}

export interface MatchConfigurationInterface {
  bestOf?: number;
  setFormat: SetFormatInterface;
  finalSetFormat: SetFormatInterface;
  timed?: boolean;
  minutes?: number;
}

export enum SetWinnerEnum {
  SIDE1 = 'SIDE1',
  SIDE2 = 'SIDE2',
  NONE = 'NONE'
}

export interface TiebreakInterface {
  side1: string;
  side2: string;
}

export enum FocusedSetInterface {
  SIDE1 = 'SIDE1',
  SIDE2 = 'SIDE2',
  NONE = 'NONE'
}

export interface GameResultInterface {
  side1: string;
  side2: string;
}

export interface SetScoresInterface {
  setNumber: number;
  side1Score?: string;
  side2Score?: string;
  side1TiebreakScore?: string;
  side2TiebreakScore?: string;
  side1?: string;
  side2?: string;
  isActive?: boolean;
  isTiebreakSet?: boolean;
  isManuallyFocused: FocusedSetInterface;
  winner: SetWinnerEnum;
  tiebreak?: TiebreakInterface;
  gameResult?: GameResultInterface;
}

export enum StatusIconSideEnum {
  side1 = 'side1',
  side2 = 'side2'
}

export interface StatusIconProps {
  displayAsIcon?: boolean;
  disabled?: boolean;
  side: StatusIconSideEnum;
  status: MatchParticipantStatus;
  onClick?: () => void;
}

export interface MatchParticipantStatusSubCategory {
  label: string;
  description: string;
  matchUpStatusCode: string;
  matchUpStatusCodeDisplay: string;
}

export interface MatchParticipantStatusCategory {
  label: string;
  subCategories: MatchParticipantStatusSubCategory[];
  hidden?: boolean;
}

export interface MatchParticipantStatus {
  categoryName: string;
  subCategoryName: string;
  matchUpStatusCode: string;
  matchUpStatusCodeDisplay: string;
}

export interface MatchUpStatusInterface {
  side1: MatchParticipantStatus;
  side2: MatchParticipantStatus;
}

export interface ScoringMatchUpInterface {
  roundName?: string;
  participantSide1?: ParticipantInterface[];
  participantSide2?: ParticipantInterface[];
  sets: SetScoresInterface[];
  status: MatchUpStatusInterface;
  matchUpStatusCode?: string;
}

export interface SetFormatSelectorStateInterface {
  exact: string;
  what: string;
}

export interface WonSets {
  side1: number;
  side2: number;
}
