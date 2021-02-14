import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@material-ui/core';

import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/HighlightOff';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import TMXIconButton from 'components/buttons/TMXIconButton';

import { useStyles } from 'components/panels/styles';
import { useOptimizedResize } from 'components/hooks/useOptimizedRefresh';

import { AdHocRoundSelector } from 'components/selectors/AdHocRound';

import { resizeDraw } from 'components/drawDisplay/drawResizing';
import { KnockoutStructure } from 'components/drawStructures/KnockoutStructure';
import { RoundRobinStructure } from 'components/drawStructures/RoundRobinStructure';
import { NoDrawsNotice } from 'components/notices/noDrawsNotice';

import { TieMatchUpContainer } from 'containers/tieMatchUp/tieMatchUpContainer';

import { drawEngine } from 'tods-competition-factory';

export const DrawsPanel = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { drawDefinition } = props;

  const scoringTieMatchUp = useSelector((state: any) => state.tmx.scoringTieMatchUp);
  const { matchUp: tieMatchUp } = scoringTieMatchUp || {};

  const selectedStructureId = useSelector((state: any) => state.tmx.select.draws.structureId);

  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  const participants = tournamentRecord.participants || [];
  const structures = drawDefinition?.structures || [];
  const { structureId: firstStructureId } = structures[0] || {};
  const structureId = selectedStructureId || firstStructureId;

  const structure = structures.reduce((structure, candidate) => {
    return candidate.structureId === structureId ? candidate : structure;
  }, undefined);

  const result = drawEngine
    .setState(drawDefinition)
    .setParticipants(participants)
    .allStructureMatchUps({ structureId });
  console.log({ drawDefinition, participants, result });
  const { matchUps, roundMatchUps } = result;

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

  const firstRoundSize = roundMatchUps && roundMatchUps[1] && roundMatchUps[1].length;
  const zoomDraw = firstRoundSize >= 16 && !drawIsAdHoc && !drawIsRoundRobin;

  useOptimizedResize(() => resizeDraw({ structure }));

  const AddAdhoc = () => {
    const addAdHocMatch = () => {
      console.log('AddAdHoc');
    };
    return (
      <Button startIcon={<AddIcon />} variant="outlined" onClick={addAdHocMatch}>
        {t('add')}
      </Button>
    );
  };

  const DeleteAdhoc = () => {
    const deleteAdHocRound = () => {
      console.log('delete AdHoc Round');
    };
    return (
      <Button startIcon={<DeleteIcon />} variant="outlined" onClick={deleteAdHocRound}>
        {t('delete')}
      </Button>
    );
  };

  const ZoomDraw = (props) => {
    const { drawDefinition } = props;
    const [zoomState, setZoomState] = useState<boolean>(false);
    const ZoomIcon = () => (zoomState ? <ZoomOutIcon /> : <ZoomInIcon />);

    const zoomDraw = () => {
      const draw = drawDefinition && drawDefinition.draw;

      if (draw) {
        if (zoomState) {
          draw.maxTreeDepth = undefined;
          setZoomState(false);
        } else {
          draw.maxTreeDepth = 3;
          setZoomState(true);
        }
        console.log('display draw with zoom change');
      }
    };
    return (
      <TMXIconButton
        id="zoomState"
        title={t('zoom')}
        onClick={zoomDraw}
        className={classes.iconMargin}
        icon={<ZoomIcon />}
      />
    );
  };

  const DrawMatic = () => {
    const configureDrawMatic = () => {
      console.log('configure DrawMatic');
    };
    return (
      <Button variant="outlined" onClick={configureDrawMatic}>
        DrawMatic
      </Button>
    );
  };

  const DrawStructure = () => {
    const props = { drawData, structureId };
    return (
      <>
        {!structure ? (
          <NoDrawsNotice />
        ) : tieMatchUp ? (
          <TieMatchUpContainer tieMatchUp={tieMatchUp} />
        ) : drawIsRoundRobin ? (
          <RoundRobinStructure {...props} />
        ) : drawIsAdHoc ? null : (
          <KnockoutStructure {...props} />
        )}
      </>
    );
  };

  const OptionsPanel = () => (
    <>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item style={{ flexGrow: 1 }}>
          {drawIsAdHoc && <AdHocRoundSelector drawDefinition={drawDefinition} />}
        </Grid>
        <Grid container item justify={'flex-end'} style={{ flexGrow: 1 }}>
          {zoomDraw && <ZoomDraw drawDefinition={drawDefinition} />}
          {drawIsAdHoc && <AddAdhoc />}
          {drawIsAdHoc && <DeleteAdhoc />}
          {drawIsAdHoc && <DrawMatic />}
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      <OptionsPanel />
      <DrawStructure />
    </>
  );
};
