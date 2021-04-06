import React from 'react';
import i18n from 'i18next';

import { AppToaster } from 'services/notifications/toaster';
// import { personProfile } from 'components/forms/Person/personProfile';

import { tmxStore } from 'stores/tmxStore';

import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeleteIcon from '@material-ui/icons/Delete';

import { tournamentEngine } from 'competitionFactory';

export function participantMenu({ participantId, participants }) {
  const participant = participants.reduce((p, c) => {
    if (c.participantId === participantId) p = c;
    return p;
  }, undefined);
  if (!participant) return;
  const menuHeader = { primary: participant.participantName || '' };

  const enteredInEvent = false;

  const { tournamentRecord } = tournamentEngine.getState();
  const signedIn = tournamentEngine.setState(tournamentRecord).getParticipantSignInStatus(participant);

  const menuItems = [
    {
      icon: <LockOpenIcon />,
      id: 'signInParticipant',
      text: i18n.t('sgi'),
      onClick: signIn,
      ignore: signedIn,
      className: 'p-sign-in'
    },
    {
      icon: <CloseIcon />,
      id: 'signOutParticipant',
      text: i18n.t('sgo'),
      onClick: signOut,
      ignore: !signedIn,
      className: 'p-sign-out'
    },
    {
      icon: <EditIcon />,
      id: 'editParticipant',
      text: i18n.t('edt'),
      onClick: editSelectedPlayer,
      className: 'pselect-edit'
    },
    {
      icon: <DeleteIcon />,
      id: 'deleteParticipant',
      text: i18n.t('dlp'),
      ignore: enteredInEvent,
      onClick: deletePlayer,
      className: 'pselect-delete'
    }
  ];

  return { menuItems, menuHeader };

  function signIn() {
    setTimeout(() => {
      const { participantId } = participant;
      const params = { participantIds: [participantId], signInState: 'SIGNED_IN' };
      tmxStore.dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'participantsSignInStatus',
              params
            }
          ]
        }
      });
    }, 300);
  }
  function signOut() {
    if (enteredInEvent) {
      return cannotSignOut();
    } else {
      setTimeout(() => {
        const { participantId } = participant;
        const params = { participantIds: [participantId], signInState: 'SIGNED_OUT' };
        tmxStore.dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'participantsSignInStatus',
                params
              }
            ]
          }
        });
      }, 300);
    }
  }

  function cannotSignOut() {
    const message = `${i18n.t('phrases.cannotsignout')} ${i18n.t('phrases.approvedplayer')}`;
    AppToaster.show({ icon: 'info-sign', intent: 'warning', message });
  }

  function editSelectedPlayer() {
    const person = participant.person;
    if (person) {
      // personProfile.open({person, minimumBirthYear: 4, maximumBirthYear: 90, callback: savePlayerEdits});
    }
  }

  /*
  function savePlayerEdits(p) {
    const person = p.person;
    const updatedParticipant = Object.assign({}, participant);
    updatedParticipant.name = `${person.standardGivenName} ${person.standardFamilyName}`;
    updatedParticipant.person = Object.assign({}, participant.person, person);

    tmxStore.dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'modifyParticipant',
            params: { participant: updatedParticipant }
          }
        ]
      }
    });
  }
  */

  function deletePlayer() {
    tmxStore.dispatch({
      type: 'alert dialog',
      payload: {
        title: `${i18n.t('delete')} ${i18n.t('ply')}`,
        content: `${i18n.t('delete')} ${participant.participantName}?`,
        cancel: true,
        okTitle: 'Delete',
        ok: doIt
      }
    });

    function doIt() {
      tmxStore.dispatch({
        type: 'tournamentEngine',
        payload: {
          methods: [
            {
              method: 'deleteParticipants',
              params: { participantIds: [participant.participantId] }
            }
          ]
        }
      });
    }
  }
}
