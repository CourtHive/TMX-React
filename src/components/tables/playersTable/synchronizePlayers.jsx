import { tournamentEngine } from 'tods-competition-factory';
import { tmxStore } from 'stores/tmxStore';

export const synchronizePlayers = () => {
  const { participants } = tournamentEngine.generateFakeParticipants({ participantsCount: 32, matchUpType: 'SINGLES' });
  tmxStore.dispatch({
    type: 'tournamentEngine',
    payload: {
      methods: [
        {
          method: 'addParticipants',
          params: { participants }
        }
      ]
    }
  });
};
