import React from 'react';
import { Controller } from 'react-hook-form';
import { makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  editField: {
    margin: theme.spacing(1)
  }
}));

export const ControlledTextField = (props) => {
  const classes = useStyles();
  const { control, name, id, label, errorMessage } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          required
          className={classes.editField}
          id={id}
          label={label}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error && errorMessage ? errorMessage : null}
        />
      )}
    />
  );
};
