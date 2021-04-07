import React from 'react';
import { useSelector } from 'react-redux';

import { DTAB_DRAW, DTAB_COMPETITORS } from 'stores/tmx/types/tabs';

import { DrawParticipants } from 'components/tables/DrawParticipants';
import { DrawsPanel } from 'components/panels/eventsPanel/DrawStructures';

export const DrawDetails = (props) => {
  const { selectedEvent, selectedDraw } = props;

  const drawView = useSelector((state) => state.tmx.visible.drawView);

  return (
    <>
      {drawView !== DTAB_DRAW ? null : <DrawsPanel event={selectedEvent} drawDefinition={selectedDraw} />}
      {drawView !== DTAB_COMPETITORS ? null : (
        <DrawParticipants selectedEvent={selectedEvent} selectedDraw={selectedDraw} />
      )}
    </>
  );
};
