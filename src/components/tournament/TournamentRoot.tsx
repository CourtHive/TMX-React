import React /*useEffect*/ from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { context } from 'services/context';

import { getJwtTokenStorageKey } from 'config/localStorage';
import { getLoginState } from 'services/authentication/loginState';

import { Grid, Tooltip, Typography, useMediaQuery } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTheme from '@material-ui/core/styles/useTheme';
import { useStyles } from 'components/tournament/styles';

import { MainMenuButton } from 'components/buttons/MainMenuButton';
import { useSaveTrigger } from 'components/hooks/useSaveTrigger';
import { AuthButton } from 'components/buttons/authButton';
import TournamentTabsContent from 'components/tournament/TournamentTabsContent';
import { TournamentTabs } from 'components/tournament/TournamentTabs';
import ProviderLogo from 'components/ProviderLogo';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { populateCalendar } from 'functions/calendar';
import { displayTournament } from 'functions/tournament/tournamentDisplay';
import { showCalendar } from 'services/screenSlaver';
import AlertDialog from 'components/dialogs/alertDialog';
import { AppToaster } from 'components/dialogs/AppToaster';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

export function TournamentRoot({ tournamentRecord, tabIndex, params }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  // const keyLoads = useSelector((state: any) => state.tmx.keyLoads);
  const loadingState = useSelector((state: any) => state.tmx.loadingState);

  const tabState = useSelector((state: any) => state.tmx.visible.tabState);

  const theme = useTheme();
  const downXs = useMediaQuery(theme.breakpoints.down('xs'));
  const loggedIn = getLoginState();
  const loginModal = () => dispatch({ type: 'login modal', payload: true });
  const logout = () => {
    localStorage.removeItem(JWT_TOKEN_STORAGE_NAME);
    dispatch({ type: 'set myTournaments' });
    setTimeout(() => {
      if (context.tournamentId) {
        displayTournament({ tournamentId: context.tournamentId, tournament: undefined, editing: undefined });
      } else {
        populateCalendar();
      }
    }, 500);
  };

  useSaveTrigger();

  /*
  useEffect(() => {
    console.log('key load');
  }, [keyLoads]);
  */

  const tournamentName = tournamentRecord.tournamentName || t('trn');

  const changeLoginState = () => {
    if (loggedIn) {
      logout();
    } else {
      loginModal();
    }
  };

  const LoginIcon = () => (
    <div className={classes.actionIcon} onClick={changeLoginState}>
      {!tabState ? (
        t('Login')
      ) : (
        <Tooltip title={t('Login')} aria-label={t('Login')}>
          {loggedIn ? <ExitToAppIcon /> : <LockOpenIcon />}
        </Tooltip>
      )}
    </div>
  );

  const navGrow = downXs && tabState === 'text' ? 1 : 0;
  const NavColumn = () => (
    <Grid item className={classes.navColumn} style={{ flexGrow: navGrow }}>
      <Grid container direction="column" justify="center" alignItems="center">
        <LoginIcon />
      </Grid>
      <Grid container direction="column" justify="flex-start">
        <TournamentTabs tournament={tournamentRecord} tabIndex={tabIndex} />
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        {/* divider and then any other menu items */}
      </Grid>
    </Grid>
  );

  const handleLogoClick = () => {
    showCalendar();
    history.push('/');
  };

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
                <AuthButton />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
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
