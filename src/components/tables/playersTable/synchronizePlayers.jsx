import { mocksEngine } from 'tods-competition-factory';
import { tmxStore } from 'stores/tmxStore';

export const synchronizePlayers = () => {
  const { participants: maleParticipants } = mocksEngine.generateParticipants({
    participantsCount: 32,
    matchUpType: 'DOUBLES',
    sex: 'MALE'
  });

  const { participants: femaleParticipants } = mocksEngine.generateParticipants({
    participantsCount: 32,
    matchUpType: 'DOUBLES',
    sex: 'FEMALE'
  });

  const participants = [...maleParticipants, ...femaleParticipants];

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
