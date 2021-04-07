import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const GenderSelector = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { options } = props || { options: [] };
  const selectedGender = useSelector((state) => state.tmx.select.participants.sex);
  const selectGender = (event) => dispatch({ type: 'participant sex', payload: event.target.value });

  return (
    <TMXSelect className={classes.select} value={selectedGender} onChange={selectGender}>
      <MenuItem value="X">
        <em>All Genders</em>
      </MenuItem>
      {options.map((t) => (
        <MenuItem key={t.value} value={t.value}>
          {t.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
