import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import { useOptimizedResize } from 'components/hooks/useOptimizedRefresh';

import { resizeDraw } from 'components/drawDisplay/drawResizing';
import { KnockoutStructure } from 'components/drawStructures/KnockoutStructure';
import { RoundRobinStructure } from 'components/drawStructures/RoundRobinStructure';
import { NoDrawsNotice } from 'components/notices/noDrawsNotice';
import NoticePaper from 'components/papers/notice/NoticePaper';

import { TieMatchUpContainer } from 'containers/tieMatchUp/tieMatchUpContainer';

import { drawEngine } from 'tods-competition-factory';
import { EliminationStructure, generateRoundsDefinition, generateStandardElimination } from 'tods-react-draws';
import { getActionsMenuData } from 'components/menus/actionsMenu';

export const DrawsPanel = (props) => {
  const { drawDefinition } = props;

  const scoringTieMatchUp = useSelector((state: any) => state.tmx.scoringTieMatchUp);
  const { matchUp: tieMatchUp } = scoringTieMatchUp || {};

  const selectedStructureId = useSelector((state: any) => state.tmx.select.draws.structureId);

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const participants = tournamentRecord.participants || [];
  const structures = drawDefinition?.structures || [];
  const selectedIsValid = structures.map(({ structureId }) => structureId).includes(selectedStructureId);
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = (selectedIsValid && selectedStructureId) || firstStructureId;

  const structure = structures.reduce((structure, candidate) => {
    return candidate.structureId === structureId ? candidate : structure;
  }, undefined);

  const result = drawEngine
    .setState(drawDefinition)
    .setParticipants(participants)
    .allStructureMatchUps({ structureId });
  const { matchUps, roundMatchUps } = result;
  const { roundsDefinition } = generateRoundsDefinition({
    roundMatchUps
  });
  const columns = generateStandardElimination({ height: 70, roundsDefinition });

  const { roundPresentationProfile } = drawEngine.getRoundPresentationProfile({ matchUps });
  console.log({ columns, roundsDefinition, roundPresentationProfile });

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

  const drawIsAdHoc = false;
  const drawIsRoundRobin = structure && structure.structures;

  useOptimizedResize(() => resizeDraw({ structure }));

  const DrawStructure = () => {
    const props = { drawData, structureId };
    return (
      <>
        {!structure ? (
          <NoDrawsNotice />
        ) : tieMatchUp ? (
          <TieMatchUpContainer tieFormat={drawDefinition.tieFormat} tieMatchUp={tieMatchUp} />
        ) : drawIsRoundRobin ? (
          <RoundRobinStructure {...props} />
        ) : drawIsAdHoc ? null : (
          <>
            <KnockoutStructure {...props} />
          </>
        )}
      </>
    );
  };

  const onScoreClick = ({ matchUp, sideIndex, e }) => {
    const menuData = getActionsMenuData({ matchUp, sideNumber: undefined });
    console.log('Scoring matchUp', { matchUp, sideIndex, e, menuData });
  };
  const onParticipantClick = ({ matchUp, sideNumber, e }) => {
    const menuData = getActionsMenuData({ matchUp, sideNumber });
    console.log('Participant matchUp', { matchUp, sideNumber, e, menuData });
  };
  const args = { columns, roundMatchUps, onScoreClick, onParticipantClick };

  return (
    <>
      <NoticePaper className={'header'} style={{ marginTop: '1em' }}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item>Draw Details:</Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="row" justify="flex-end">
              Actions
            </Grid>
          </Grid>
        </Grid>
      </NoticePaper>
      <DrawStructure />
      <div>
        <EliminationStructure {...args} />
      </div>
    </>
  );
};
