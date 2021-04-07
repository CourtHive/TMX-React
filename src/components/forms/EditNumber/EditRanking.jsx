import React from 'react';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { TextField } from '@material-ui/core';

export function EditRanking(props) {
  const { ranking, onChange } = props;
  const defaultValues = { ranking };
  const { register, errors } = useForm({ validationSchema, defaultValues, mode: 'onChange' });
  const rankingChange = (event) => {
    const value = event.target.value;
    if (onChange && typeof onChange === 'function' && !errors.ranking) {
      onChange(value);
    }
  };
  return (
    <TextField
      name="ranking"
      inputRef={register}
      error={Boolean(errors.ranking)}
      onChange={rankingChange}
      inputProps={{ style: { textAlign: 'right' } }}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      helperText={errors.ranking && 'Whole Number'}
    />
  );
}
