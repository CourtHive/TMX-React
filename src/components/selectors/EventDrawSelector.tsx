import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const EventDrawSelector = (props) => {
  const { onChange } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const tournamentEvents = tournamentRecord.events || [];
  const selectedEventId = useSelector((state: any) => state.tmx.select.events.event) || '-';
  const selectedEvent = tournamentEvents.find((e) => e.eventId === selectedEventId);

  const eventDraws = selectedEvent?.drawDefinitions;
  const selectedDraw = useSelector((state: any) => state.tmx.select.draws.draw);
  const selectedExists = selectedDraw && eventDraws?.reduce((p, c) => p || c.drawId === selectedDraw, false);
  const firstDraw = eventDraws?.length && eventDraws[0].drawId;

  const targetDraw = (selectedExists && selectedDraw) || firstDraw;

  const selectDraw = (event) => {
    let value = event.target.value;
    if (value === '-') value = undefined;
    dispatch({ type: `select event draw`, payload: value });
    if (onChange && typeof onChange === 'function') onChange(value);
  };

  const drawOption = (drawDefinition) => {
    const category = drawDefinition.category ? `${drawDefinition.category} ` : '';
    const name = drawDefinition.drawName || drawDefinition.name || drawDefinition.drawId;
    return { text: `${category}${name}`, value: drawDefinition.drawId };
  };

  const drawOptions = eventDraws?.map(drawOption);

  if (!eventDraws?.length) return null;
  return (
    <TMXSelect className={classes.select} value={targetDraw} onChange={selectDraw}>
      <MenuItem value="-">
        <em>{t('schedule.alldraws')}</em>
      </MenuItem>
      {drawOptions.map((e) => (
        <MenuItem key={e.value} value={e.value}>
          {e.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
