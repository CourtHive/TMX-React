import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { GroupingSelector } from 'components/selectors/GroupingSelector';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const NONE = '-';

export function AddToGrouping(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const { open, onClose, onSubmit, tableData, groupParticipants, teamParticipants } = props;
  const [groupingParticipantId, setGroupingParticipantId] = useState(NONE);
  
  const checkedParticipants = tableData.filter((row) => row.checked);
  const selectedParticipantIds = checkedParticipants.map((row) => row.id);

  const teamParticipantIds = teamParticipants.map(t=>t.participantId);
  const groupParticipantIds = groupParticipants.map(t=>t.participantId);

  const teamIsSelected = teamParticipantIds.includes(groupingParticipantId);
  const groupIsSelected = groupParticipantIds.includes(groupingParticipantId);
  const selectedGroup = groupIsSelected && groupParticipants
    .find(groupParticipant => groupParticipant.participantId === groupingParticipantId);
  const removeIsValid = selectedGroup && (selectedGroup.individualParticipants || [])
    .find(participantId => selectedParticipantIds.includes(participantId));

  const addToGrouping = () => {
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'addParticipantsToGrouping',
            params: {
              participantIds: selectedParticipantIds,
              groupingParticipantId,
              removeFromOtherTeams: teamIsSelected
            }
          }
        ]
      }
    });
    onSubmit();
  }

  const removeFromAllTeams = () => {
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'removeParticipantsFromAllTeams',
            params: {
              participantIds: selectedParticipantIds,
            }
          }
        ]
      }
    });
    onSubmit();
  }

  const removeFromGroup = () => {
    const checkedParticipants = tableData.filter((row) => row.checked);
    const selectedParticipantIds = checkedParticipants.map((row) => row.id);
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'removeParticipantsFromGroup',
            params: {
              groupingParticipantId,
              participantIds: selectedParticipantIds,
            }
          }
        ]
      }
    });
    onSubmit();
  }

  return (
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>{t('Grouping Options')}</DialogTitle>
        <DialogContent>
          <GroupingSelector groupingParticipantId={groupingParticipantId} onChange={setGroupingParticipantId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='secondary'>{t('ccl')}</Button>
          {
            groupingParticipantId !== NONE ? null :
            <Button onClick={removeFromAllTeams}>{t('Remove From All Teams')}</Button>
          }
          {
            groupingParticipantId !== NONE && removeIsValid ?
            <Button onClick={removeFromGroup}>{t('Remove')}</Button> : null
          }
          {
            groupingParticipantId === NONE ? null :
            <Button onClick={addToGrouping}>{t('Add')}</Button>
          }
        </DialogActions>
      </Dialog>
  )
}
