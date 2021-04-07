import React from 'react';
import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip, TextField } from '@material-ui/core';

export function MultiComboBox({
  label,
  prompt,
  options,
  onChange,
  selections,
  disabled = [],
  noOptionsText,
  freeSolo = true,
  promptActive = true
}) {
  const editState = useSelector((state) => state.tmx.editState);
  const getTitle = (option) => (typeof option === 'object' ? option.title : option);
  function getOptionSelected(option, value) {
    return value.title === option.title;
  }
  return (
    <Autocomplete
      multiple
      value={selections}
      autoComplete={true}
      onChange={onChange}
      freeSolo={freeSolo}
      autoHighlight={true}
      disabled={!editState}
      disableClearable={true}
      options={options}
      filterSelectedOptions={true}
      noOptionsText={noOptionsText}
      getOptionSelected={getOptionSelected}
      getOptionLabel={(option) => option.title}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            key={getTitle(option)}
            label={getTitle(option)}
            {...getTagProps({ index })}
            disabled={disabled.indexOf(getTitle(option)) >= 0}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder={!prompt || !promptActive ? '' : prompt}
          fullWidth
        />
      )}
    />
  );
}
