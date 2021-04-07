import React from 'react';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { TextField } from '@material-ui/core';

export function EditParticipantRanking(props) {
  const { participantId, ranking, onChange } = props;
  const defaultValues = { ranking };
  const { register, errors } = useForm({ validationSchema, defaultValues, mode: 'onChange' });
  const handleOnChange = (event) => {
    const value = event.target.value;
    const result = { participantId, value };
    if (onChange && typeof onChange === 'function' && !errors.ranking) {
      onChange(result);
    }
  };
  return (
    <TextField
      key={`ranking`}
      name="ranking"
      inputRef={register}
      style={{ maxWidth: '2em' }}
      error={Boolean(errors.ranking)}
      onChange={handleOnChange}
      inputProps={{ style: { textAlign: 'right' } }}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      helperText={errors.ranking && 'Whole Number'}
    />
  );
}
