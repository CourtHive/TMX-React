import React from 'react';

import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import { LoginModal } from './modals/login/LoginModal';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useStyles } from 'components/styles';
import MainRouter from '../router/MainRouter';
import DateFnsUtils from '@date-io/date-fns';
import { tmxStore } from 'stores/tmxStore';
import { DndProvider } from 'react-dnd';
import { theme } from 'theme/theme';

const SplashImage = <img src={SPLASH} style={{ width: '100%', maxWidth: '800px' }} alt="tmxLogo" />;
import SPLASH from 'images/splash.png';

const SplashInterceptor = () => {
  const classes = useStyles();
  const dbLoaded = useSelector((state) => state.tmx.dbLoaded);

  return (
    <>
      {dbLoaded ? (
        <>
          <LoginModal />
          <MainRouter />
        </>
      ) : (
        <div id="splash" className={classes.splash}>
          {SplashImage}
        </div>
      )}
    </>
  );
};

const TMX = () => {
  const BASENAME = process.env.REACT_APP_ROUTER_BASENAME || '';

  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={tmxStore}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={responsiveFontSizes(theme)}>
            <BrowserRouter basename={BASENAME}>
              <SplashInterceptor />
            </BrowserRouter>
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    </DndProvider>
  );
};

export default TMX;
