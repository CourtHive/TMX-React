import React from 'react';
import { Controller } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const ControlledSelector = (props) => {
  const classes = useStyles();
  const { override = 'formControl', items, options, label, control, name, onChange, id } = props;
  if (!items && (!options || !options.length)) return '';
  const menuItems =
    items ||
    options.map((t) => (
      <MenuItem key={t.value} value={t.value}>
        {t.text}
      </MenuItem>
    ));

  return (
    <FormControl variant="standard" className={classes[override]}>
      <InputLabel> {label} </InputLabel>
      <Controller
        id={id}
        name={name}
        control={control}
        autoWidth={true}
        onChange={onChange}
        className={classes.selectEmpty}
        as={<TMXSelect>{menuItems}</TMXSelect>}
      />
    </FormControl>
  );
};
