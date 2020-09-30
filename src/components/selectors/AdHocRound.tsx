import React from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export function AdHocRoundSelector(props) {
  const { drawDefinition } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  const selectedRound = useSelector((state: any) => state.tmx.select.draws.round);
  const adHocMatches = (drawDefinition.draw && drawDefinition.draw.matches) || [];
  const existingRounds = adHocMatches
    .map((m) => m.round)
    .filter((r) => r && !isNaN(r))
    .reduce((p, c) => (p.indexOf(c) >= 0 ? p : p.concat(c)), [1]);
  const maxRound = Math.max(...existingRounds);
  // TODO: this is not necessary here if maxRound is calculated on an as-needed basis
  // drawDefinition.rounds = maxRound;
  existingRounds.sort().push(maxRound + 1);
  const roundOptions = [].concat(...existingRounds.map((r) => ({ text: `${t('rnd')}: ${r}`, value: r })));

  const selectRound = (event) => {
    let value = event.target.value;
    dispatch({ type: 'select adhoc round', payload: value });
  };
  return (
    <TMXSelect
      id="round-select"
      variant="outlined"
      className={classes.select}
      value={selectedRound}
      onChange={selectRound}
    >
      <MenuItem value="-">{t('schedule.allrounds')}</MenuItem>
      {roundOptions.map((t) => (
        <MenuItem key={t.value} value={t.value}>
          {t.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
}
