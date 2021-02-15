import React from 'react';

import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams
} from '@material-ui/lab/Autocomplete/Autocomplete';
import { TextField } from '@material-ui/core';
import { useStyles } from 'components/autocomplete/styles';

type TMXAutocomplete<T> = Omit<
  AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput'
>;

export interface TMXAutocompleteProps<T> extends TMXAutocomplete<T> {
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
}

const TMXAutocomplete = <T extends unknown>({ ...props }: TMXAutocompleteProps<T>) => {
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
