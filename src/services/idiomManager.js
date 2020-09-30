import React from 'react';
import { useTranslation } from 'react-i18next';
import { IDIOM_SELECTED } from 'constants/localStorage';
import { coms } from 'services/communications/SocketIo/coms';
import { changeIdiom as i18nChangeIdiom } from 'services/changeIdiom';
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

let availableIdioms = {};

export function receiveIdiomList(data) {
  const idiomArray = data
    .filter((f) => f)
    .map((row) => JSON.parse(row))
    .filter((f) => f)
    .map((value) => ({ [value.ioc]: value }));
  availableIdioms = Object.assign({}, ...idiomArray);

  const lng = (localStorage.getItem(IDIOM_SELECTED) || 'en').toLowerCase();
  const a = availableIdioms[lng];
  if (a && a.updated) {
    const request = `${lng}.idiom`;
    coms.sendKey(request);
  }
}

export function IdiomSelector() {
  const { t } = useTranslation();
  const validOptions = Object.keys(availableIdioms).map((i) => ({ ioc: i.toUpperCase() }));
  const currentIdiom = localStorage.getItem(IDIOM_SELECTED) || 'en';
  const codeMatch = (country) => currentIdiom && country.ioc === currentIdiom;
  const currentlySelected = countries.reduce((p, c) => (codeMatch(c) ? c : p), undefined);

  const validIOCs = validOptions.reduce((p, c) => (c.ioc && p.indexOf(c.ioc) < 0 ? p.concat(c.ioc) : p), []);
  const validISOs = validOptions.reduce((p, c) => (c.iso && p.indexOf(c.iso) < 0 ? p.concat(c.iso) : p), []);
  const onlySelection = currentlySelected ? [currentlySelected] : [];
  const options = !validOptions.length
    ? onlySelection
    : countries.filter((c) => validIOCs.indexOf(c.ioc) >= 0 || validISOs.indexOf(c.iso) >= 0);

  const defineCountry = (_, selection) => {
    if (selection && selection.ioc) i18nChangeIdiom({ lng: selection.ioc });
  };

  return (
    <CountrySelect
      label={t('lang')}
      onChange={defineCountry}
      options={options}
      noOptionsText={'No Options'}
      selection={currentlySelected}
    />
  );
}

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
