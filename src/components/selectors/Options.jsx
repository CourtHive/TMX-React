import React, { useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const Options = (props) => {
  const { override = 'formControl', value, options, label, onChange } = props;
  const classes = useStyles();
  const [selectedType, newType] = useState(value);

  const selectionEvent = (event) => {
    if (onChange && typeof onChange === 'function') onChange(event.target.value);
    newType(event.target.value);
  };

  const Selector = () => (
    <FormControl variant="standard" className={classes[override]}>
      <InputLabel> {label} </InputLabel>
      <TMXSelect autoWidth={true} className={classes.selectEmpty} value={selectedType} onChange={selectionEvent}>
        {options.map((t) => (
          <MenuItem key={t.value} value={t.value}>
            {t.text}
          </MenuItem>
        ))}
      </TMXSelect>
    </FormControl>
  );
  return <> {options.length ? <Selector /> : ''} </>;
};
