import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';
import { stringSort } from 'functions/strings';

export const RoundSelector = (props) => {
  const { onChange } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const selectedRound = useSelector((state: any) => state.tmx.select.schedule.round);

  // TODO: access tournamentMatchUps
  const matchUps = [];

  const unscheduledMatchUps = matchUps.filter((m) => m.winner === undefined);

  const roundNames = unscheduledMatchUps.reduce((p, c) => (p.indexOf(c.roundName) < 0 ? p.concat(c.roundName) : p), []);

  useEffect(() => {
    if (selectedRound !== '-' && roundNames.indexOf(selectedRound) < 0) {
      dispatch({ type: `select schedule round`, payload: '-' });
    }
  });
  const roundOptions = roundNames.sort(stringSort).map((name) => ({ text: `Round ${name}`, value: name }));

  const selectRound = (event) => {
    const value = event.target.value;
    dispatch({ type: `select schedule round`, payload: value });
    if (onChange && typeof onChange === 'function') onChange(value);
  };

  if (!unscheduledMatchUps.length) return null;
  return (
    <TMXSelect className={classes.select} value={selectedRound} onChange={selectRound}>
      <MenuItem value="-">
        {' '}
        <em>{t('schedule.allrounds')}</em>{' '}
      </MenuItem>
      {roundOptions.map((e, i) => (
        <MenuItem key={`x${e.value}${i}`} value={e.value}>
          {e.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
