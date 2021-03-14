import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import { useMediaQuery } from '@material-ui/core';

import { useStylesCommon, useStylesMatchParticipant } from 'components/dialogs/scoringObjectDialog/styles';

const MatchUpSide = ({ sideNumber, matchUp }) => {
  const classesCommon = useStylesCommon();
  const classes = useStylesMatchParticipant();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const side = matchUp?.sides?.find((side) => side.sideNumber === sideNumber);
  const participant = side?.participant;
  const participants = participant?.individualParticipants || [participant].filter((f) => f);

  return (
    <Grid container justify="space-between" className={classes.matchParticipantWrapper}>
      <Grid item>
        {participants?.map((participant, index) => (
          <Typography
            key={participant.id || index}
            className={`${
              participants.length === 1 ? classes.participantTypographySingle : classes.participantTypographyDouble
            } ${matches ? classes.participantTypographyFont : classes.participantTypographyFontXS}`}
          >
            {participant.participantName}
          </Typography>
        ))}
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Grid
            item
            className={
              matches
                ? `${classesCommon.setEntry} ${classes.moreHorizontalIconWrapper}`
                : `${classesCommon.setEntryXS} ${classes.moreHorizontalIconWrapperXS}`
            }
          ></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MatchUpSide;
