import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';
import { drawRoute } from 'components/tournament/tabRoute';

export const EventDrawSelector = (props) => {
  const { onChange } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const { selectedEvent, selectedDraw, tournamentRecord } = props;
  const { tournamentId } = tournamentRecord || {};
  const { drawId: selectedDrawId } = selectedDraw || {};

  const eventDraws = selectedEvent?.drawDefinitions;
  const selectedExists = selectedDraw && eventDraws?.reduce((p, c) => p || c.drawId === selectedDrawId, false);
  const firstDraw = eventDraws?.length && eventDraws[0].drawId;

  const targetDraw = (selectedExists && selectedDrawId) || firstDraw;

  const selectDraw = (event) => {
    let value = event.target.value;
    if (value === '-') value = undefined;
    dispatch({ type: `select event draw`, payload: value });
    const nextRoute = drawRoute({ tournamentId, eventId: selectedEvent?.eventId, drawId: value });
    history.push(nextRoute);
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
      {drawOptions.map((e, i) => (
        <MenuItem key={e.value || i} value={e.value}>
          {e.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
};
