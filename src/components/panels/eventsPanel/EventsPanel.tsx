import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ErrorBoundary from 'services/errors/errorBoundary';
import { Breadcrumbs, Grid } from '@material-ui/core';

import NoticePaper from 'components/papers/notice/NoticePaper';
import { EventDrawList } from 'components/tables/DrawList';
import { EventsTable } from 'components/tables/EventsTable';
import { DrawOptions } from 'components/forms/EditDraw/DrawOptions';
import { EditDrawDrawer } from 'components/forms/EditDraw/DrawDrawer';
import { EditEventDrawer } from 'components/forms/EditEvent/EditEvent';
import { AddParticipantsDrawer } from 'components/forms/EditEvent/EventParticipants';
import { EventParticipants } from 'components/tables/EventParticipants';
import { DrawDetails } from 'components/panels/eventsPanel/DrawDetails';

import { EventSelector } from 'components/selectors/EventSelector';
import { EventDrawSelector } from 'components/selectors/EventDrawSelector';
import { StructureSelector } from 'components/selectors/StructureSelector';

import { DTAB_DRAW } from 'stores/tmx/types/tabs';
import { tournamentEngine, entryStatusConstants, fixtures } from 'tods-competition-factory';
import { defaultTieFormat } from 'policies/defaultTieFormat';

import { PanelSelector } from 'components/selectors/PanelSelector';
import { TAB_EVENTS } from 'stores/tmx/types/tabs';

const { STRUCTURE_ENTERED_TYPES } = entryStatusConstants;
const { SEEDING_ITF, SCORING_POLICY } = fixtures;

export const EventsPanel = ({ tournamentRecord, params }) => {
  const dispatch = useDispatch();

  const selectedEventId = params?.eventId;
  const tournamentEvents = tournamentRecord.events || [];
  const eventCount = tournamentEvents?.length || 0;
  const participants = tournamentRecord.participants || [];
  const selectedDrawId = params?.drawId;

  const selectedEvent = tournamentEvents.reduce((selected, event) => {
    const drawIds = event?.drawDefinitions?.map((drawDefinition) => drawDefinition.drawId);
    const eventIdMatch = event.eventId === selectedEventId;
    const drawIdFound = drawIds?.includes(selectedDrawId);
    return eventIdMatch || drawIdFound ? event : selected;
  }, undefined);

  const tournamentDraws = tournamentEvents
    .map((event) => event.drawDefinitions)
    .flat()
    .filter((f) => f);

  const drawDefinition = tournamentDraws.reduce((p, c) => (c.drawId === selectedDrawId ? c : p), undefined);

  const drawDrawerCallback = (values) => {
    dispatch({ type: 'visible drawer' });
    if (values) {
      const matchUpType = selectedEvent.eventType;
      const policyDefinitions = [SCORING_POLICY, SEEDING_ITF];
      const drawEntries = selectedEvent?.entries
        .filter(({ entryStatus }) => STRUCTURE_ENTERED_TYPES.includes(entryStatus))
        .slice(0, values.drawSize);
      Object.assign(values, { drawEntries, eventId: selectedEvent.eventId, matchUpType, policyDefinitions });
      const result = tournamentEngine.generateDrawDefinition(values);
      const { drawDefinition } = result;
      if (matchUpType === 'TEAM') {
        drawDefinition.tieFormat = defaultTieFormat();
      }
      const { eventId } = selectedEvent;
      if (eventId && drawDefinition) {
        dispatch({
          type: 'tournamentEngine',
          payload: {
            methods: [
              {
                method: 'addDrawDefinition',
                params: { eventId, drawDefinition }
              }
            ]
          }
        });
      }
    }
  };

  return (
    <ErrorBoundary>
      <EditEventDrawer />
      <EditDrawDrawer callback={drawDrawerCallback} selectedEvent={selectedEvent} participants={participants} />
      <AddParticipantsDrawer
        tournamentRecord={tournamentRecord}
        selectedEvent={selectedEvent}
        selectedDraw={drawDefinition}
        participants={participants}
      />
      <Toolbar
        eventCount={eventCount}
        participants={participants}
        selectedEvent={selectedEvent}
        selectedDraw={drawDefinition}
        tournamentRecord={tournamentRecord}
      />
      {selectedEvent ? (
        <EventDisplay selectedEvent={selectedEvent} selectedDraw={drawDefinition} participants={participants} />
      ) : (
        <>
          <NoticePaper className={'header'} style={{ marginTop: '1em' }}>
            <Grid container spacing={2} direction="row" justify="flex-start">
              <Grid item>Tournament Details:</Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Grid container direction="row" justify="flex-end">
                  Actions
                </Grid>
              </Grid>
            </Grid>
          </NoticePaper>
          <EventsTable events={tournamentEvents} />
        </>
      )}
    </ErrorBoundary>
  );
};

const EventDisplay = (props) => {
  const { selectedEvent, selectedDraw, participants } = props;
  return (
    <>
      {selectedDraw ? (
        <DrawDetails selectedEvent={selectedEvent} selectedDraw={selectedDraw} participants={participants} />
      ) : (
        <EventDetails selectedEvent={selectedEvent} />
      )}
    </>
  );
};

const EventDetails = (props) => {
  const { selectedEvent } = props;
  return (
    <>
      <NoticePaper className={'header'} style={{ marginTop: '1em' }}>
        Event Details
      </NoticePaper>
      <EventDrawList selectedEvent={selectedEvent} />
      <EventParticipants selectedEvent={selectedEvent} />
    </>
  );
};

const Toolbar = (props) => {
  const dispatch = useDispatch();

  const { selectedEvent, selectedDraw, tournamentRecord } = props;
  const drawView = useSelector((state: any) => state.tmx.visible.drawView);
  const drawsTabSelected = drawView === DTAB_DRAW;

  const structures = selectedDraw?.structures || [];
  const selectedStructureId = useSelector((state: any) => state.tmx.select.draws.structureId);
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = selectedStructureId || firstStructureId;

  const selectStructure = ({ itemId }) => {
    dispatch({ type: 'select structure', payload: { structureId: itemId } });
  };

  const multipleDrawStructures = selectedDraw?.structures?.length > 1;

  const handlePanelSelectorClick = () => {
    // console.log('boo');
  };

  return (
    <Grid container direction="row" justify="flex-start">
      <Grid item>
        <Grid container item justify="flex-start">
          <Breadcrumbs aria-label="breadcrumb">
            <PanelSelector
              tournamentId={tournamentRecord.tournamentId}
              contextId={TAB_EVENTS}
              onClick={handlePanelSelectorClick}
            />
            {selectedEvent && <EventSelector tournamentRecord={tournamentRecord} selectedEvent={selectedEvent} />}
            {selectedDraw && (
              <EventDrawSelector
                selectedEvent={selectedEvent}
                selectedDraw={selectedDraw}
                tournamentRecord={tournamentRecord}
              />
            )}
            {drawsTabSelected && multipleDrawStructures && (
              <StructureSelector
                structureId={structureId}
                drawDefinition={selectedDraw}
                selectStructure={selectStructure}
              />
            )}
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid item style={{ flexGrow: 1 }}>
        <Grid container direction="row" item justify={'flex-end'}>
          {selectedDraw ? <DrawOptions /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

// {selectedDraw ? <DrawOptions selectedDraw={selectedDraw} participants={participants} /> : null}
