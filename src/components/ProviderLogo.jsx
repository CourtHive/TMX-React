import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import { useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { logOut } from 'services/authentication/loginState';
import TournamentLogo from 'components/tournament/TournamentLogo';
import { useStyles } from 'components/tournament/styles';
import { LoginButton } from './buttons/LoginButton';
import TMXavatar from './buttons/TMXAvatar';
import { useSelector } from 'react-redux';

const ProviderLogo = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const authState = useSelector((state) => state.tmx.authState);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const menuItems = [
    {
      id: 'logout',
      text: 'Logout',
      onClick: () => logOut()
    }
  ];

  const loginStateProps = {
    tooltip: 'User',
    id: 'loginStateButton',
    // initial: loggedIn?.email && (loggedIn.email[0] || 'u').toUpperCase(),
    menuItems
  };

  return (
    <Grid className={!downSm ? classes.menuRightWrapper : classes.menuRightWrapperSm} container direction="row">
      <Grid className={classes.menuRightSubWrapper} item>
        <TournamentLogo {...props} />
      </Grid>
      <Grid className={classes.menuRightSubWrapper} item>
        {authState ? <TMXavatar {...loginStateProps} /> : <LoginButton />}
      </Grid>
    </Grid>
  );
};

export default ProviderLogo;
