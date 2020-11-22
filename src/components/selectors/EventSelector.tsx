import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';
import { eventRoute } from 'components/tournament/tabRoute';

export const EventSelector = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const { selectedEvent, tournamentRecord } = props;
  const events = tournamentRecord?.events || [];
  const selectedEventId = selectedEvent?.eventId;
  const { tournamentId } = tournamentRecord || {};

  const selectEvent = (event) => {
    let payload = event.target.value;
    if (payload === '-') payload = undefined;
    dispatch({ type: 'select event', payload });
    const nextRoute = eventRoute({ tournamentId, eventId: payload });
    history.push(nextRoute);
  };
  const options = events.map((event) => ({ text: event.eventName, value: event.eventId }));

  return (
    <>
      {!options.length ? null : (
        <TMXSelect className={classes.select} value={selectedEventId} onChange={selectEvent}>
          <MenuItem value="-">
            <em>{t('schedule.allevents')}</em>
          </MenuItem>
          {options.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.text}
            </MenuItem>
          ))}
        </TMXSelect>
      )}
    </>
  );
};
