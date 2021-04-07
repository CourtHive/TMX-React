import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import { fixtures } from 'tods-competition-factory';
const { countries, countryToFlag } = fixtures;

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18
    }
  }
});

export function CountrySelect({ label, selection, options, onChange, enableAll, inputRef }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Autocomplete
      autoHighlight
      options={enableAll ? countries : options}
      value={selection}
      autoComplete={true}
      onChange={onChange}
      style={{ width: 'auto' }}
      disableClearable={true}
      classes={{ option: classes.option }}
      getOptionLabel={(option) => option.label}
      renderOption={(option) => (
        <React.Fragment>
          <span>{countryToFlag(option.iso || '')}</span>
          {option.label}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          fullWidth
          {...params}
          label={label}
          // variant="outlined"
          placeholder={`${t('select')}...`}
          value={selection}
          name={'country'}
          inputRef={inputRef}
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}
