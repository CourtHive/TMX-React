import { env } from 'config/defaults';
import { utilities, timeItemConstants } from 'tods-competition-factory';
import { MatchUpInterface } from 'typedefs/store/scheduleTypes';

const { convertTime, DateHHMM } = utilities;
const { SCHEDULED_TIME } = timeItemConstants;

export const convertMatchUpsToRows = (umTableDataMatchUps: MatchUpInterface[]) =>
  umTableDataMatchUps
    ?.filter((matchUp) => matchUp.timeItems?.find((scheduleItem) => scheduleItem.itemSubject === SCHEDULED_TIME))
    ?.map(matchUpAsRow);

export const matchUpAsRow = (matchUp, index) => {
  if (!matchUp) return;
  return {
    index: index + 1,
    id: matchUp.matchUpId,
    schedule: matchUp.schedule,
    checkedInParticipantIds: matchUp.checkedInParticipantIds,
    matchUpId: matchUp.matchUpId,
    time: convertTime(DateHHMM(matchUp.schedule.scheduledTime), env),
    eventName: matchUp.eventName,
    round: matchUp.roundNumber,
    side1: matchUp.sides[0]?.participant?.name || 'None',
    side2: matchUp.sides[1]?.participant?.name || 'None',
    side1Id: matchUp.sides[0]?.participant?.participantId || 'None',
    side2Id: matchUp.sides[1]?.participant?.participantId || 'None'
  };
};
