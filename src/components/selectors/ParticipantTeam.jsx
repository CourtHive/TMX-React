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

const noneUUID = 'z009900a';

export function ParticipantTeam({ id, label, name, selection, options, onChange, enableNone=true }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const noneOption = { name: t('NONE'), participantId: noneUUID };

  const handleGetOptionSelected = (option, value) =>
    !option || value === '' || option.participantId === value.participantId;

  if (enableNone) {
    selection = selection || noneOption;
    options = options || [selection];
    const containsNone = options.find(option => option.participantId === noneUUID);
    if (!containsNone) options.unshift(noneOption);
  }

  const handleOnChange = (_, selection) => {
    const value = (selection.participantId === noneOption.participantId) ? undefined : selection;
    onChange(value);
  }

  return (
    <Autocomplete
      autoHighlight
      options={options}
      value={selection}
      autoComplete={true}
      onChange={handleOnChange}
      style={{ width: 'auto' }}
      disableClearable={true}
      classes={{ option: classes.option, }}
      getOptionLabel={option => option.name}
      getOptionSelected={handleGetOptionSelected}
      renderInput={params => (
        <TextField
          id={id}
          fullWidth
          {...params}
          label={label}
          variant="outlined"
          placeholder={`${t('select')}...`}
          value={selection}
          name={name}
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}

