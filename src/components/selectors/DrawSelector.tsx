import React from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const DrawSelector = (props) => {
  const { mode = 'matchUps', onChange } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const tournamentEvents = tournamentRecord.events || [];

  const tournamentDraws = tournamentEvents
    .map((event) => event.drawDefinitions)
    .flat()
    .filter((f) => f);

  const selectedDraw = useSelector((state: any) => state.tmx.select[mode].draw);
  const selectedExists = selectedDraw && tournamentDraws.reduce((p, c) => p || c.drawId === selectedDraw, false);
  const firstDraw = tournamentDraws.length && tournamentDraws[0].drawId;

  const targetDraw =
    mode === 'draws' ? (selectedExists && selectedDraw) || firstDraw : (selectedExists && selectedDraw) || '-';

  const selectDraw = (event) => {
    const value = event.target.value;
    dispatch({ type: `select ${mode} draw`, payload: value });
    if (onChange && typeof onChange === 'function') onChange(value);
  };

  const drawOption = (drawDefinition) => {
    let category = drawDefinition.category ? `${drawDefinition.category} ` : '';
    const name = drawDefinition.drawName || drawDefinition.name || drawDefinition.drawId;
    return { text: `${category}${name}`, value: drawDefinition.drawId };
  };

  const drawOptions = tournamentDraws.map(drawOption);

  if (!tournamentDraws.length) return null;
  return (
    <TMXSelect variant="outlined" className={classes.select} value={targetDraw} onChange={selectDraw}>
      {mode !== 'matchUps' ? (
        ''
      ) : (
        <MenuItem value="-">
          {' '}
          <em>{t('schedule.alldraws')}</em>{' '}
        </MenuItem>
      )}
      {drawOptions.map((e) => (
        <MenuItem key={e.value} value={e.value}>
          {e.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
