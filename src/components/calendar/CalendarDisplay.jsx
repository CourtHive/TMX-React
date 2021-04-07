import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, useMediaQuery } from '@material-ui/core';
import { useStyles } from './style';

import { TournamentsTable } from 'components/tables/TournamentsTable';
import useTheme from '@material-ui/core/styles/useTheme';

import { EditTournamentDrawer } from 'components/forms/EditTournament/EditTournament';
import ProviderLogo from 'components/ProviderLogo';

export function TMXcalendar() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const keyLoads = useSelector((state) => state.tmx.keyLoads);
  // const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const downXs = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    // reload on keyLoad
  }, [keyLoads]);

  return (
    <>
      <EditTournamentDrawer />
      <Grid container direction="row" justify="space-between" className={classes.headerRoot}>
        <Grid item xs={downXs ? 12 : 'auto'}>
          <Grid container direction="column">
            <Grid item className={classes.headerRootPaddingNoBottom}>
              <Paper elevation={0} className={classes.paper}>
                <Grid container direction="row">
                  <Grid item>
                    <Typography align="left" component="h2" className={classes.title}>
                      {t('Tournament Calendar')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={downXs ? 12 : 'auto'}>
          <ProviderLogo />
        </Grid>
      </Grid>
      <Grid container direction="column" className={classes.root}>
        <TournamentsTable />
      </Grid>
    </>
  );
}
