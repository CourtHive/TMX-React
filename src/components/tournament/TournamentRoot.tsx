import React /*useEffect*/ from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Grid, Typography, useMediaQuery } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTheme from '@material-ui/core/styles/useTheme';
import { useStyles } from 'components/tournament/styles';

import { MainMenuButton } from 'components/buttons/MainMenuButton';
import TournamentTabsContent from 'components/tournament/TournamentTabsContent';
import { TournamentTabs } from 'components/tournament/TournamentTabs';
import ProviderLogo from 'components/ProviderLogo';

import AlertDialog from 'components/dialogs/alertDialog';
import { AppToaster } from 'components/dialogs/AppToaster';

export function TournamentRoot({ tournamentRecord, tabIndex, params }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const loadingState = useSelector((state: any) => state.tmx.loadingState);

  const tabState = useSelector((state: any) => state.tmx.visible.tabState);

  const theme = useTheme();
  const downXs = useMediaQuery(theme.breakpoints.down('xs'));

  const tournamentName = tournamentRecord?.tournamentName || t('trn');

  const navGrow = downXs && tabState === 'text' ? 1 : 0;
  const NavColumn = () => (
    <Grid item className={classes.navColumn} style={{ flexGrow: navGrow }}>
      <Grid container direction="column" justify="center" alignItems="center"></Grid>
      <Grid container direction="column" justify="flex-start">
        <TournamentTabs tournament={tournamentRecord} tabIndex={tabIndex} />
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        {/* divider and then any other menu items */}
      </Grid>
    </Grid>
  );

  const handleLogoClick = () => {
    history.push('/');
  };

  if (!tournamentRecord) return null;

  return (
    <>
      {!loadingState ? '' : <LinearProgress />}
      <Grid
        container
        direction="row"
        justify="space-between"
        className={downXs ? classes.headerRoot : classes.headerRootPadding}
        style={{ flexWrap: 'nowrap' }}
      >
        <Grid container direction="row" justify="flex-start">
          <Grid item>
            <MainMenuButton />
          </Grid>

          <Grid item xs={downXs ? 12 : 'auto'}>
            <Grid item className={classes.headerRootPaddingNoBottom}>
              <Grid container direction="row">
                <Typography onClick={handleLogoClick} align="left" component="h2" className={classes.tournamentName}>
                  {tournamentName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item style={{ width: 200 }}>
          <ProviderLogo onClick={handleLogoClick} />
        </Grid>
      </Grid>

      <Grid container direction="row" justify="space-between" style={{ flexWrap: 'nowrap' }}>
        {[undefined, 'none'].includes(tabState) ? null : <NavColumn />}
        {downXs && tabState === 'text' ? null : (
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="column" className={classes.content}>
              <TournamentTabsContent tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={params} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <AlertDialog />
      <AppToaster />
    </>
  );
}
