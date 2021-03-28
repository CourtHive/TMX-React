import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import RefreshIcon from '@material-ui/icons/Autorenew';
import PeopleIcon from '@material-ui/icons/People';
import EmptyPeopleIcon from '@material-ui/icons/PeopleAltOutlined';
import TMXMenuButton from 'components/buttons/TMXMenuButton';
import { useStyles } from './style';

import { tournamentEngine, entryStatusConstants, participantTypes } from 'tods-competition-factory';
import { SelectReps } from 'components/forms/playerReps';
import { RemakeDrawModal } from 'components/buttons/RemakeDraw';

const { INDIVIDUAL } = participantTypes;
const { STRUCTURE_ENTERED_TYPES } = entryStatusConstants;

export const DrawActions = ({ hasReps, drawDefinition }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [repModalOpen, setRepModalOpen] = useState(false);
  const [drawRegenOpen, setDrawRegenOpen] = useState(false);
  const { drawId, entries: drawEntries } = drawDefinition || {};

  const { tournamentParticipants } = tournamentEngine.getTournamentParticipants({
    participantFilters: { participantTypes: [INDIVIDUAL] }
  });

  const representativeParticipantIds = [];
  // const { representativeParticipantIds } = tournamentEngine.getDrawParticipantRepresentativeIds({ drawId });

  const eligibleEnteredParticipantIds = drawEntries
    ?.filter(({ entryStatus }) => STRUCTURE_ENTERED_TYPES.includes(entryStatus))
    ?.map(({ participantId }) => participantId);
  const eligibleParticipantReps = tournamentParticipants?.filter(({ participantId }) =>
    eligibleEnteredParticipantIds.includes(participantId)
  );
  const saveSelectedReps = (representatives) => {
    setRepModalOpen(false);

    const representativeParticipantIds = (representatives || []).map((participant) => participant.participantId);
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'setDrawParticipantRepresentativeIds',
            params: { representativeParticipantIds, drawId }
          }
        ]
      }
    });
  };

  const repsColor = representativeParticipantIds.length === 2 ? 'success' : 'warning';
  const RepIcon = () => (hasReps ? <PeopleIcon /> : <EmptyPeopleIcon />);

  const actionMenuItems = [
    {
      icon: <RefreshIcon />,
      id: 'drawRegen',
      text: 'Regenerate',
      onClick: () => setDrawRegenOpen(true)
    },
    {
      icon: <RepIcon />,
      id: 'drawReps',
      intent: repsColor,
      text: 'Representatives',
      onClick: () => setRepModalOpen(true)
    }
  ];

  return (
    <>
      <TMXMenuButton
        className={classes.iconMargin}
        id="drawActions"
        title={t('Draw Actions')}
        menuItems={actionMenuItems}
      />
      {repModalOpen && (
        <SelectReps
          onCancel={() => setRepModalOpen(false)}
          existingReps={representativeParticipantIds}
          drawPlayers={eligibleParticipantReps}
          callback={saveSelectedReps}
        />
      )}
      <RemakeDrawModal drawId={drawId} open={drawRegenOpen} setOpen={setDrawRegenOpen} />
    </>
  );
};
