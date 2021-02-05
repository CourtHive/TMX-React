export enum USTAMatchFormatTypeEnum {
  STANDARD = 'STANDARD',
  SHORT = 'SHORT',
  PRO = 'PRO',
  TIEBREAK = 'TIEBREAK',
  TIMED = 'TIMED'
}
export interface USTAMatchFormatInterface {
  key: string;
  name: string;
  format: string;
  type: USTAMatchFormatTypeEnum;
}
export interface MappedDialogFormatsReturnObject {
  standard: USTAMatchFormatInterface[];
  short: USTAMatchFormatInterface[];
  pro: USTAMatchFormatInterface[];
  tiebreak: USTAMatchFormatInterface[];
  timed: USTAMatchFormatInterface[];
}
