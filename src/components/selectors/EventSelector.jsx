import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { eventRoute } from 'components/tournament/tabRoute';
import ListSelect from 'components/selectors/tmxList/ListSelect';

export const EventSelector = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const { selectedEvent, tournamentRecord } = props;
  const events = tournamentRecord?.events || [];
  const selectedEventId = selectedEvent?.eventId;
  const { tournamentId } = tournamentRecord || {};

  const selectEvent = (event) => {
    let payload = event.itemId;
    if (payload === 'ALL') payload = undefined;
    dispatch({ type: 'select event', payload });
    const nextRoute = eventRoute({ tournamentId, eventId: payload });
    history.push(nextRoute);
  };

  const unselect = { itemName: t('schedule.allevents'), itemId: 'ALL' };
  const eventItems = events.map((event) => ({ itemName: event.eventName, itemId: event.eventId }));
  const items = [].concat(unselect, ...eventItems);

  return <ListSelect items={items} selectedId={selectedEventId} onChange={selectEvent} />;
};
