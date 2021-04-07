import { DropTypeEnum } from 'components/tables/EndlessTable/typedefs';
import { drawEngine } from 'tods-competition-factory';

export const scheduleOnDrop = (
  dragObject,
  dropType,
  dropRowId,
  endIndex,
  dispatch,
  dateSelected,
  umTableDataMatchUps,
  uMScheduleData
) => {
  const startIndex = dragObject.startIndex;
  console.log({ dropType });
  switch (dropType) {
    case DropTypeEnum.REORDER_ROWS: {
      if (startIndex !== endIndex) {
        const firstToLast = endIndex > startIndex;
        const sliceStart = Math.min(startIndex, endIndex);
        const sliceEnd = Math.max(startIndex, endIndex) + 1;
        const matchUpsContextIds = umTableDataMatchUps
          .slice(sliceStart, sliceEnd)
          .filter((matchUp) => !matchUp.schedule?.courtId)
          .map((matchUp) => {
            const { matchUpId, schedule, drawId, eventId, structureId, tournamentId } = matchUp || {};
            return { matchUpId, schedule, drawId, eventId, structureId, tournamentId };
          });
        console.log('reorderUpcomingMatchUPs');
        dispatch({
          type: 'competitionEngine',
          payload: { matchUpsContextIds, firstToLast },
          method: 'reorderUpcomingMatchUps'
        });
      } else {
        console.log({ startIndex, endIndex });
      }
      break;
    }
    case DropTypeEnum.ADD_TO_CELL: {
      const item = dragObject.item;
      uMScheduleData?.forEach((data) => {
        data.courts.forEach((court, index) => {
          if (index === endIndex && data.id === dropRowId) {
            const droppedData = {
              id: uMScheduleData[parseInt(dropRowId) - 1].id,
              courts: uMScheduleData[parseInt(dropRowId) - 1].courts.map((court) => ({ ...court }))
            };
            const droppedCourtMatch = droppedData.courts[endIndex]?.matchUp;
            const targetCourtId = droppedData.courts[endIndex].courtId;
            const { matchUpId: sourceMatchUpId } = item;
            const { matchUpId: targetMatchUpId } = droppedCourtMatch || {};

            const sourceMatchUpContextIds = drawEngine.getMatchUpContextIds({
              matchUps: umTableDataMatchUps,
              matchUpId: sourceMatchUpId
            });
            const targetMatchUpContextIds = drawEngine.getMatchUpContextIds({
              matchUps: umTableDataMatchUps,
              matchUpId: targetMatchUpId
            });
            dispatch({
              type: 'competitionEngine',
              payload: { sourceMatchUpContextIds, targetMatchUpContextIds, targetCourtId, courtDayDate: dateSelected },
              method: 'matchUpScheduleChange'
            });
          }
        });
      });
      break;
    }
    case DropTypeEnum.REORDER_CELLS: {
      if (uMScheduleData) {
        const item = dragObject.item;
        const draggedData = {
          id: item.id,
          courts: item.courts.map((court) => ({ ...court }))
        };
        const droppedData = {
          id: uMScheduleData[parseInt(dropRowId) - 1].id,
          courts: uMScheduleData[parseInt(dropRowId) - 1].courts.map((court) => ({ ...court }))
        };
        const draggedCourtMatch = draggedData.courts[startIndex]?.matchUp;
        const droppedCourtMatch = droppedData.courts[endIndex]?.matchUp;
        const { matchUpId: sourceMatchUpId } = draggedCourtMatch || {};
        const { matchUpId: targetMatchUpId } = droppedCourtMatch || {};
        const sourceCourtId = draggedData.courts[startIndex]?.courtId;
        const targetCourtId = droppedData.courts[endIndex]?.courtId;

        const sourceMatchUpContextIds = drawEngine.getMatchUpContextIds({
          matchUps: umTableDataMatchUps,
          matchUpId: sourceMatchUpId
        });
        const targetMatchUpContextIds = drawEngine.getMatchUpContextIds({
          matchUps: umTableDataMatchUps,
          matchUpId: targetMatchUpId
        });
        dispatch({
          type: 'competitionEngine',
          payload: {
            courtDayDate: dateSelected,
            sourceMatchUpContextIds,
            targetMatchUpContextIds,
            sourceCourtId,
            targetCourtId
          },
          method: 'matchUpScheduleChange'
        });
      }
      break;
    }
    default:
      console.log('Wrong drop type');
  }
};
