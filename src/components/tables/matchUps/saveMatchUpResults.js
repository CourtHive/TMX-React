import { tmxStore } from 'stores/tmxStore';

export function saveMatchUpResults({ matchUps }) {
  const outcomes = matchUps
    .filter((matchUp) => matchUp.updated)
    .map((matchUp) => ({
      drawId: matchUp.drawId,
      eventId: matchUp.eventId,
      matchUpId: matchUp.matchUpId,
      matchUpFormat: matchUp.matchUpFormat,
      matchUpStatus: matchUp.matchUpStatus,
      winningSide: matchUp.winningSide,
      score: matchUp.score,
      sets: matchUp.sets
    }));

  if (outcomes.length) {
    tmxStore.dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'bulkMatchUpStatusUpdate',
            params: { outcomes }
          }
        ]
      }
    });
  }
}
