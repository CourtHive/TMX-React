import React from 'react'
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

export function SearchSelect({
  label, defaultValue, selection, options,
  onChange, name, inputRef, getOptionSelected
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Autocomplete
      autoHighlight
      options={options}
      value={selection}
      autoComplete={true}
      onChange={onChange}
      disableClearable={true}
      style={{ width: 'auto' }}
      defaultValue={defaultValue}
      classes={{ option: classes.option, }}
      getOptionSelected={getOptionSelected}
      getOptionLabel={option => option?.name || ''}
      renderInput={params => (
        <TextField
          fullWidth
          {...params}
          label={label}
          variant="outlined"
          placeholder={`${t('select')}...`}
          value={selection}
          name={name}
          inputRef={inputRef}
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}

