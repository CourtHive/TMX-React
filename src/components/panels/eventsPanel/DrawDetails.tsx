import React from 'react';
import { useSelector } from 'react-redux';

import { DTAB_DRAW, DTAB_COMPETITORS, DTAB_SETTINGS } from 'stores/tmx/types/tabs';

import { DrawParticipants } from 'components/tables/DrawParticipants';
import { DrawsPanel } from 'components/panels/eventsPanel/DrawStructures';
import { DrawSettings } from 'components/panels/eventsPanel/DrawSettings';

export const DrawDetails = (props) => {
  const { selectedEvent, selectedDraw, participants } = props;

  const drawView = useSelector((state: any) => state.tmx.visible.drawView);

  return (
    <>
      {drawView !== DTAB_DRAW ? null : <DrawsPanel event={selectedEvent} drawDefinition={selectedDraw} />}
      {drawView !== DTAB_COMPETITORS ? null : (
        <DrawParticipants selectedEvent={selectedEvent} selectedDraw={selectedDraw} />
      )}
      {drawView !== DTAB_SETTINGS ? null : <DrawSettings drawDefinition={selectedDraw} participants={participants} />}
    </>
  );
};
