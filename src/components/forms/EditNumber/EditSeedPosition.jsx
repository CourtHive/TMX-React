import React from 'react';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';

export function EditSeedPosition(props) {
  // const { seedPosition, onChange } = props;
  // NOTE: attempted to cause re-render when participants change so
  // that all seedPosition entry fields update when one changes... didn't work
  const { participantId, eventId, onChange } = props;
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);

  const participants = tournamentRecord.participants || [];
  const participant = participants.reduce((p, c) => (c.participantId === participantId ? c : p), undefined);
  const seedPosition = participant && participant.manualSeeding && participant.manualSeeding[eventId];
  const defaultValues = { seedPosition };
  const { register, errors } = useForm({ validationSchema, defaultValues, mode: 'onChange' });
  const seedPositionChange = (event) => {
    const value = event.target.value;
    if (onChange && typeof onChange === 'function' && !errors.seedPosition) {
      onChange(value);
    }
  };
  return (
    <TextField
      name="seedPosition"
      inputRef={register}
      error={Boolean(errors.seedPosition)}
      onChange={seedPositionChange}
      inputProps={{ style: { textAlign: 'right' } }}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      helperText={errors.seedPosition && 'Whole Number'}
    />
  );
}
