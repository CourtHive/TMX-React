import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

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

import { DTAB_DRAW } from 'stores/tmx/types/tabs';
import { tournamentEngine, fixtures } from 'tods-competition-factory';
const { SEEDING_ITF, SCORING_POLICY } = fixtures;

export const EventsPanel: React.FC = () => {
  const dispatch = useDispatch();

  const selectedEventId = useSelector((state: any) => state.tmx.select.events.event);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const tournamentEvents = tournamentRecord.events || [];
  const eventCount = tournamentEvents?.length || 0;
  const participants = tournamentRecord.participants || [];

  const selectedEvent = tournamentEvents.reduce((p, c) => (c.eventId === selectedEventId ? c : p), undefined);
  const selectedDrawId = useSelector((state: any) => state.tmx.select.draws.draw);

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
      <AddParticipantsDrawer />
      <Toolbar
        eventCount={eventCount}
        selectedEvent={selectedEvent}
        selectedDraw={drawDefinition}
        participants={participants}
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

  const { eventCount, selectedEvent, selectedDraw, participants } = props;
  const drawView = useSelector((state: any) => state.tmx.visible.drawView);
  const drawsTabSelected = drawView === DTAB_DRAW;

  const structures = selectedDraw?.structures || [];
  const selectedStructureId = useSelector((state: any) => state.tmx.select.draws.structureId);
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = selectedStructureId || firstStructureId;

  const allEvents = `${t('schedule.allevents')} (${eventCount})`;
  const clearEventSelections = () => dispatch({ type: 'clear event selections' });

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
                <EventSelector />
              </div>
            )}
            {selectedDraw && <EventDrawSelector />}
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
