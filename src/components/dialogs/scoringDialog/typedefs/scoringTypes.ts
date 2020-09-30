import { ParticipantInterface } from 'components/dialogs/scoringDialog/typedefs/participantTypes';

export interface TiebreakFormatInterface {
  NoAD?: boolean;
  tiebreakTo: number;
}

export interface SetFormatInterface {
  timed?: boolean;
  minutes?: number;
  setTo: number;
  NoAD?: boolean;
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
  tdmCode: string;
}

export interface MatchParticipantStatusCategory {
  label: string;
  subCategories: MatchParticipantStatusSubCategory[];
  hidden?: boolean;
}

export interface MatchParticipantStatus {
  categoryName: string;
  subCategoryName: string;
  tdmCode: string;
}

export interface MatchStatusInterface {
  side1: MatchParticipantStatus;
  side2: MatchParticipantStatus;
}

export interface ScoringMatchUpInterface {
  roundName?: string;
  participantSide1: ParticipantInterface[];
  participantSide2: ParticipantInterface[];
  sets: SetScoresInterface[];
  status: MatchStatusInterface;
}

export interface SetFormatSelectorStateInterface {
  exact: string;
  what: string;
}

export interface WonSets {
  side1: number;
  side2: number;
}
