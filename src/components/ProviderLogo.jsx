import React from 'react';

import { useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';

import TournamentLogo from 'components/tournament/TournamentLogo';
import { useStyles } from 'components/tournament/styles';

const ProviderLogo = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid className={!downSm ? classes.menuRightWrapper : classes.menuRightWrapperSm} container direction="row">
      <Grid className={classes.menuRightSubWrapper} item>
        <TournamentLogo {...props} />
      </Grid>
    </Grid>
  );
};

export default ProviderLogo;
