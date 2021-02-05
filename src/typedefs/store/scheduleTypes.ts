// TODO: move out of /store folder to the /typedefs folder
import { SideInterface } from 'typedefs/store/tmxTypes';
import { SetScoresInterface } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import { TieFormatInterface } from 'typedefs/drawTypes';

export interface BookingType {
  startTime: string;
  endTime: string;
}

export interface CourtDateAvailabilityType {
  date: string;
  startTime: string;
  endTime: string;
  booking?: BookingType[];
}

export interface CourtType {
  courtId: string;
  courtName: string;
  dateAvailability: CourtDateAvailabilityType[];
  locationId?: string;
  altitude?: string;
  latitude?: string;
  longitude?: string;
  notes?: string;
  onlineProfiles?: any[]; // TODO: provide type
  surfaceCategory?: string; // TODO: is this an enum?
  surfaceDate?: string;
  surfaceType?: string; // TODO: is this an enum?
}

export interface FinishingPositionRangeType {
  loser: number[];
  winner: number[];
}

export interface TimeItemBaseType {
  createdAt: string;
  itemType: string; // TODO: define enum
  itemSubject?: string; // TODO: define enum
  itemClass?: string; // TODO: define enu,
  notes?: string;
}

export interface SIValueType extends TimeItemBaseType {
  itemValue: string;
}

export interface SILocationDetailsType {
  locationId: string;
  courtName: string;
  courtId: string;
}

export interface SILocationType extends TimeItemBaseType {
  locationDetails: SILocationDetailsType;
}

export interface SIOfficialType {
  role: string; // TODO: provide enum
  participantId: string;
  standardGivenName: string;
  standardFamilyName: string;
}

export interface SIOfficialDetailsType extends TimeItemBaseType {
  officialDetails: SIOfficialType;
}

export interface SISuspensionType {
  suspensionCode: string;
}

export interface SISuspensionDetailsType extends TimeItemBaseType {
  suspensionDetails: SISuspensionType;
}

export interface SIMedicalType {
  participantId: string;
}

export interface SIMedicalDetailsType extends TimeItemBaseType {
  medicalDetails: SIMedicalType;
}

export type TimeItemType =
  | TimeItemBaseType
  | SIValueType
  | SILocationType
  | SIOfficialDetailsType
  | SISuspensionDetailsType
  | SIMedicalDetailsType;

export interface MatchUpSchedule {
  courtId: string;
  endTime: string;
  milliseconds: string;
  scheduledTime: string;
  startTime: string;
  time: string;
}

export interface MatchUpInterface {
  assigned?: boolean;
  allParticipantsCheckedIn?: boolean;
  checkedInParticipantIds?: string[];
  collectionId?: string;
  collectionPosition?: number;
  drawId: string;
  drawPositions: number[];
  eventId?: string;
  eventName?: string;
  finishingPositionRange: FinishingPositionRangeType;
  finishingRound: number;
  matchUpFormat: string;
  tieFormat?: TieFormatInterface;
  matchUpId: string;
  matchUpStatus: string; // TODO: define enums of possible statuses
  matchUpStatusCodes?: string[];
  matchUpType?: string;
  roundName?: string;
  roundNumber: number;
  roundPosition: number;
  schedule?: MatchUpSchedule;
  score?: any;
  sets?: SetScoresInterface[];
  structureId: string;
  structureName: string; // TODO: define enums of possible structure names
  tieMatchUps?: MatchUpInterface[];
  timeItems?: TimeItemType[];
  tournamentId?: string;
  sides: SideInterface[] | undefined[]; // TODO: use camelCase
  winningSide?: number;
  readyToScore?: boolean;
}
