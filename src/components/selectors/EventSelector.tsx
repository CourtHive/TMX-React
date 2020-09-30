import React from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const EventSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const events = tournamentRecord.events || [];
  const selectedEventId = useSelector((state: any) => state.tmx.select.events.event) || '-';
  const selectEvent = (event) => {
    let payload = event.target.value;
    if (payload === '-') payload = undefined;
    dispatch({ type: 'select event', payload });
  }
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
