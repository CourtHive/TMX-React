import { matchUpFilter } from 'components/tables/utils';

export const getFilteredMatchUpsTableData = (classes, matchUps, selectedDraw, selectedRowIndex, teamIds) => {
  const filteredMatchUps = matchUps
    .filter((matchUp) => matchUpFilter(matchUp, teamIds, selectedDraw))
    .map((matchUp, index) => {
      return {
        index: index,
        id: matchUp.matchUpId,
        matchUpId: matchUp.matchUpId,
        className: index === selectedRowIndex ? classes.selectedRow : undefined,
        roundName: `${matchUp.roundNumber || ''}`,
        event: matchUp.eventName,
        format: matchUp.matchUpType,
        date: '',
        court: '',
        umpire: '',
        matchUpFormat: matchUp.matchUpFormat,
        scheduleTime: matchUp.schedule.time,
        startTime: matchUp.schedule.startTime,
        endTime: matchUp.schedule.endTime,
        player1: matchUp.sides && matchUp.sides[0]?.participant?.participantName,
        player2: matchUp.sides && matchUp.sides[1]?.participant?.participantName,
        status: matchUp.matchUpStatus,
        score: matchUp.score,
        readyToScore: matchUp.readyToScore,
        winningSide: matchUp.winningSide
      };
    });
  return filteredMatchUps;
};
