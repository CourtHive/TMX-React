import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Grid } from '@material-ui/core';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
import { NoDrawsNotice } from 'components/notices/noDrawsNotice';
import NoticePaper from 'components/papers/notice/NoticePaper';

import { TieMatchUpContainer } from 'containers/tieMatchUp/tieMatchUpContainer';

// import { drawEngine } from 'tods-competition-factory';

import { tournamentEngine } from 'tods-competition-factory';
import { DrawStructureContainer } from 'components/drawDisplay/DrawStructureContainer';
import { DrawActions } from './DrawActions';

export const DrawsPanel = (props) => {
  const { drawDefinition, event } = props;
  const [menuData, setMenuData] = useState(undefined);

  const scoringTieMatchUp = useSelector((state) => state.tmx.scoringTieMatchUp);
  const { matchUp: tieMatchUp } = scoringTieMatchUp || {};

  const selectedStructureId = useSelector((state) => state.tmx.select.draws.structureId);

  /*
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);
  const participants = tournamentRecord.participants || [];
  */
  const structures = drawDefinition?.structures || [];
  const selectedIsValid = structures.map(({ structureId }) => structureId).includes(selectedStructureId);
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = (selectedIsValid && selectedStructureId) || firstStructureId;

  const structure = structures.reduce((structure, candidate) => {
    return candidate.structureId === structureId ? candidate : structure;
  }, undefined);

  /*
  const result = drawEngine
    .setState(drawDefinition)
    .setParticipants(participants)
    .allStructureMatchUps({ structureId, context: { eventId: event?.eventId } });
  const { matchUps, roundMatchUps } = result;
  */
  const { eventData } = tournamentEngine.getEventData({ eventId: event.eventId }) || {};

  const { drawId } = drawDefinition || {};
  /*
  const { nextUnfilledDrawPositions } = drawEngine.getNextUnfilledDrawPositions({ structureId });

  const renderMatchUps = matchUps.filter((matchUp) => matchUp.drawPositions);
  const drawData = {
    matchUps: renderMatchUps,
    drawDefinition,
    structure,
    roundMatchUps,
    participants,
    nextUnfilledDrawPositions
  };
  */

  const drawIsAdHoc = false;
  const drawIsRoundRobin = structure && structure.structures;

  const knockoutArgs = { eventData, drawId, structureId };
  const closeMenu = () => setMenuData({});

  const DrawStructure = () => {
    return (
      <>
        {!structure ? (
          <NoDrawsNotice />
        ) : tieMatchUp ? (
          <TieMatchUpContainer tieFormat={drawDefinition.tieFormat} tieMatchUp={tieMatchUp} />
        ) : drawIsRoundRobin ? (
          <DrawStructureContainer {...knockoutArgs} />
        ) : drawIsAdHoc ? null : (
          <DrawStructureContainer {...knockoutArgs} />
        )}
      </>
    );
  };

  return (
    <>
      <NoticePaper className={'header'} style={{ marginTop: '1em', marginBottom: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Draw Details:</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              <DrawActions drawDefinition={drawDefinition} hasReps={drawIsRoundRobin} />
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
      <DrawStructure />
      <TMXPopoverMenu {...menuData} closeMenu={closeMenu} />
    </>
  );
};
