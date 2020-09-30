import React from 'react';
import { useTranslation } from "react-i18next";
import { useStyles } from 'components/panels/infoPanel/style';

import { Grid, Typography } from '@material-ui/core/';

import { InfoButtonGroup } from 'components/buttons/buttonGroups/InfoButtonGroup';

export function TournamentView() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start" style={{flexWrap: 'wrap'}}>
        <Grid item>
          <Typography variant="h1" className={classes.sectionTitle}>
            {t('Tournament Details')}
          </Typography>
        </Grid>
        <Grid item style={{flexGrow: 1}}>
          <Grid container direction="row" item justify='flex-end'>
            <InfoButtonGroup />
          </Grid>
        </Grid>
    </Grid>
  )
}
