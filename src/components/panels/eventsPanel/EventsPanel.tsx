import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import ErrorBoundary from 'services/errors/errorBoundary';
import { Breadcrumbs, Grid, Link } from '@material-ui/core';
import { useStyles } from 'components/panels/styles';

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

import { DTAB_DRAW, TAB_EVENTS } from 'stores/tmx/types/tabs';
import { tournamentEngine, fixtures } from 'tods-competition-factory';
import { tabRoute } from 'components/tournament/tabRoute';
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

  tournamentEngine.setState(tournamentRecord);

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
      Object.assign(values, { eventId: selectedEvent.eventId, matchUpType, policyDefinitions });
      const { drawDefinition } = tournamentEngine.generateDrawDefinition(values);
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
        <EventsTable events={tournamentEvents} />
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
      <EventDrawList selectedEvent={selectedEvent} />
      <EventParticipants selectedEvent={selectedEvent} />
    </>
  );
};

const Toolbar = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const { eventCount, selectedEvent, selectedDraw, participants, tournamentRecord } = props;
  const drawView = useSelector((state: any) => state.tmx.visible.drawView);
  const drawsTabSelected = drawView === DTAB_DRAW;

  const structures = selectedDraw?.structures || [];
  const selectedStructureId = useSelector((state: any) => state.tmx.select.draws.structureId);
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = selectedStructureId || firstStructureId;

  const allEvents = `${t('schedule.allevents')} (${eventCount})`;
  const clearEventSelections = () => {
    dispatch({ type: 'clear event selections' });
    const { tournamentId } = tournamentRecord;
    const nextRoute = tabRoute({ tournamentId, tabIndex: TAB_EVENTS });
    history.push(nextRoute);
  };

  const selectStructure = (evt) => {
    const structureId = evt.target.value;
    dispatch({ type: 'select structure', payload: { structureId } });
  };

  const multipleDrawStructures = selectedDraw?.structures?.length > 1;

  return (
    <Grid container direction="row" justify="flex-start">
      <Grid item>
        <Grid container item justify="flex-start">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="primary" onClick={clearEventSelections} className={classes.link}>
              {allEvents}
            </Link>
            {selectedEvent && (
              <div style={{ marginBottom: 5 }}>
                <EventSelector tournamentRecord={tournamentRecord} selectedEvent={selectedEvent} />
              </div>
            )}
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
          {selectedDraw ? <DrawOptions selectedDraw={selectedDraw} participants={participants} /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
};
