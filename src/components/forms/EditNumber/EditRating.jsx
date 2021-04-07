import React from 'react';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { TextField } from '@material-ui/core';

export function EditRating(props) {
  const { rating, onChange } = props;
  const defaultValues = { rating };
  const { register, errors } = useForm({ validationSchema, defaultValues, mode: 'onChange' });
  const ratingChange = (event) => {
    const value = event.target.value;
    if (onChange && typeof onChange === 'function' && !errors.rating) {
      onChange(value);
    }
  };
  return (
    <TextField
      name="rating"
      inputRef={register}
      onChange={ratingChange}
      error={Boolean(errors.rating)}
      helperText={errors.rating && 'Number'}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      inputProps={{ style: { textAlign: 'right' } }}
    />
  );
}
