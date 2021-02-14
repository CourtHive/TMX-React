import { RowData } from 'components/tables/EndlessTable';
import { matchUpFilter } from 'components/tables/utils';
import { MatchUpInterface } from 'typedefs/store/scheduleTypes';

export interface MatchUpsTableDataInterface extends RowData {
  index: number;
  roundName: string;
  event: string;
  format: string;
  date: string;
  court: string;
  umpire: string;
  scheduleTime: string;
  startTime: string;
  endTime: string;
  player1: string;
  player2: string;
  status: string;
  score: string;
  matchUpFormat?: string;
  readyToScore?: boolean;
}

export const getFilteredMatchUpsTableData = (
  classes,
  matchUps: MatchUpInterface[],
  selectedDraw,
  selectedRowIndex,
  teamIds?: string[]
): MatchUpsTableDataInterface[] => {
  const filteredMatchUps = matchUps
    .filter((matchUp) => matchUpFilter(matchUp, teamIds, selectedDraw))
    .map((matchUp, index) => {
      const score = typeof matchUp?.score === 'object' ? matchUp.score.scoreStringSide1 : matchUp.score;

      return {
        index: index,
        id: matchUp.matchUpId,
        matchUpId: matchUp.matchUpId,
        className: index === selectedRowIndex ? classes.selectedRow : undefined,
        roundName: `${matchUp.roundNumber}`,
        event: matchUp.eventName,
        format: matchUp.matchUpType,
        // TODO: where these come from?
        date: '',
        court: '',
        umpire: '',
        matchUpFormat: matchUp.matchUpFormat,
        scheduleTime: matchUp.schedule.time,
        startTime: matchUp.schedule.startTime,
        endTime: matchUp.schedule.endTime,
        // TODO: what happens for doubles?
        player1: matchUp.sides && matchUp.sides[0]?.participant?.participantName,
        player2: matchUp.sides && matchUp.sides[1]?.participant?.participantName,
        status: matchUp.matchUpStatus,
        score,
        readyToScore: matchUp.readyToScore
      };
    });
  console.log(matchUps[0], filteredMatchUps[0]);
  return filteredMatchUps;
};
