import React from 'react';
import { Controller } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const ControlledSelector = (props) => {
  const classes = useStyles();
  const { override = 'formControl', items, options, label, control, name, id, defaultValue } = props;
  if (!items && (!options || !options.length)) return '';
  const menuItems =
    items ||
    options.map((t) => (
      <MenuItem key={t.value} value={t.value}>
        {t.text}
      </MenuItem>
    ));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <FormControl variant="standard" className={classes[override]}>
          <InputLabel> {label} </InputLabel>
          <TMXSelect
            id={id}
            autoWidth={true}
            onChange={onChange}
            defaultValue={defaultValue}
            className={classes.selectEmpty}
          >
            {menuItems}
          </TMXSelect>
        </FormControl>
      )}
    />
  );
};
