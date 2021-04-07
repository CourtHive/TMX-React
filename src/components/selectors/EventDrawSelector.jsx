import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { drawRoute } from 'components/tournament/tabRoute';
import ListSelect from 'components/selectors/tmxList/ListSelect';

export const EventDrawSelector = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const { selectedEvent, selectedDraw, tournamentRecord } = props;
  const { tournamentId } = tournamentRecord || {};
  const { drawId: selectedDrawId } = selectedDraw || {};

  const eventDraws = selectedEvent?.drawDefinitions;
  const selectedExists = selectedDraw && eventDraws?.reduce((p, c) => p || c.drawId === selectedDrawId, false);
  const firstDrawId = eventDraws?.length && eventDraws[0].drawId;

  const targetDrawId = (selectedExists && selectedDrawId) || firstDrawId;

  const selectDraw = (event) => {
    let payload = event.itemId;
    if (payload === 'ALL') payload = undefined;
    dispatch({ type: 'select event draw', payload });
    const nextRoute = drawRoute({ tournamentId, eventId: selectedEvent?.eventId, drawId: payload });
    history.push(nextRoute);
  };

  const unselect = { itemName: t('schedule.alldraws'), itemId: 'ALL' };
  const drawItems = eventDraws.map((drawDefinition) => ({
    itemName: drawDefinition.drawName,
    itemId: drawDefinition.drawId
  }));
  const items = [].concat(unselect, ...drawItems);

  if (!eventDraws?.length) return null;
  return <ListSelect items={items} selectedId={targetDrawId} onChange={selectDraw} />;
};
