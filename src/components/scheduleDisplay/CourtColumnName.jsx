import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useStylesCommon } from 'components/scheduleDisplay/styles';

const CourtColumnName = ({ subtitle, title }) => {
  const classes = useStylesCommon();

  return (
    <Grid className={classes.courtTitleWrapper} container direction="column">
      <Grid item xs="auto">
        <Typography className={classes.courtTitle} variant="h1">
          {title}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Typography className={classes.courtSubtitle} variant="body1">
          {subtitle}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CourtColumnName;
