import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PeopleIcon from '@material-ui/icons/People';
import EmptyPeopleIcon from '@material-ui/icons/PeopleAltOutlined';
import TMXIconButton from 'components/buttons/TMXIconButton';

import { env } from 'config/defaults';
import { SelectReps } from 'components/forms/playerReps';
import { useStyles } from './style';

export const RepresentativesButton = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { participants, drawDefinition } = props;
  const { drawId } = drawDefinition || {};

  const entryIds = drawDefinition?.entries?.map((e) => e.participantId);
  const representativeParticipantIds = drawDefinition?.entries
    .filter((e) => e.representative)
    .map((e) => e.participantId);
  const hasReps = representativeParticipantIds?.length;

  const [repValue, setRepValue] = useState(hasReps);
  const [modal, modalVisible] = useState(false);

  const callback = (representatives) => {
    modalVisible(false);
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'setDrawParticipantRepresentatives',
            params: { representatives, drawId }
          }
        ]
      }
    });
    setRepValue(representatives.length);
  };

  const drawPlayerIds =
    entryIds &&
    participants &&
    participants
      .filter((participant) => entryIds.includes(participant.participantId))
      .map((participant) => {
        if (participant.individualParticipants) {
          return participant.individualParticipants.map((ip) => (typeof ip === 'string' ? ip : ip.participantId));
        }
        return participant.participantId;
      })
      .filter((f) => f)
      .flat();

  const drawPlayers = drawPlayerIds && participants.filter((p) => drawPlayerIds.includes(p.participantId));

  const existingReps =
    drawDefinition &&
    participants
      .filter((participant) => representativeParticipantIds.includes(participant.participantId))
      .map((participant) => {
        if (participant.individualParticipants) {
          return participant.individualParticipants;
        }
        return participant;
      })
      .filter((f) => f)
      .flat();

  const color = repValue ? 'primary' : 'default';
  const RepIcon = () => (repValue ? <PeopleIcon /> : <EmptyPeopleIcon />);

  if (!env.visibleButtons.representatives) return null;

  return (
    <>
      {!modal ? (
        ''
      ) : (
        <SelectReps
          onCancel={() => modalVisible(false)}
          existingReps={existingReps}
          drawPlayers={drawPlayers}
          callback={callback}
        />
      )}
      <TMXIconButton
        color={color}
        id="setPlayerReps"
        title={t('draws.playerreps')}
        onClick={() => modalVisible(true)}
        className={classes.iconMargin}
        icon={<RepIcon />}
      />
    </>
  );
};
