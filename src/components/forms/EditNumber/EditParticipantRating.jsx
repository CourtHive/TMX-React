import React from 'react';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { TextField } from '@material-ui/core';

export function EditParticipantRating(props) {
  const { participantId, rating, onChange } = props;
  const defaultValues = { rating };
  const { register, errors } = useForm({ validationSchema, defaultValues, mode: 'onChange' });
  const handleOnChange = (event) => {
    const value = event.target.value;
    const result = { participantId, value };
    if (onChange && typeof onChange === 'function' && !errors.rating) {
      onChange(result);
    }
  };
  return (
    <TextField
      key={`rating`}
      name="rating"
      inputRef={register}
      style={{ maxWidth: '3em' }}
      error={Boolean(errors.rating)}
      onChange={handleOnChange}
      inputProps={{ style: { textAlign: 'right' } }}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      helperText={errors.rating && 'Whole Number'}
    />
  );
}
