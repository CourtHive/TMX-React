import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { TextField } from '@material-ui/core';
import { useStyles } from 'components/autocomplete/styles';

const TMXAutocomplete = ({ ...props }) => {
  const classes = useStyles();
  return (
    <Autocomplete
      renderInput={
        props.renderInput
          ? props.renderInput
          : (params) => <TextField className={classes.autocompleteInput} {...params} variant="standard" />
      }
      {...props}
    />
  );
};

export default TMXAutocomplete;
