import React from 'react';
import { Grid } from '@material-ui/core';

import { RemakeDrawAction } from 'components/buttons/RemakeDraw';
import { RepresentativesButton } from 'components/buttons/Representatives';

export const DrawSettings = (props) => {
  const { drawDefinition, participants } = props;
  const { drawId } = drawDefinition || {};

  const remakeDrawVisible = true;
  const playerReps = Boolean(participants && participants.length);

  return (
    <>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid container item justify={'flex-end'} style={{ flexGrow: 1 }}>
          {remakeDrawVisible && <RemakeDrawAction drawId={drawId} />}
          {playerReps && <RepresentativesButton participants={participants} drawDefinition={drawDefinition} />}
        </Grid>
      </Grid>
    </>
  );
};
