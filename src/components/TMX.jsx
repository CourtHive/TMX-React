import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import { ThemeProvider } from '@material-ui/core/styles';

import MainRouter from '../router/MainRouter';
import { Login } from './forms/login/loginModal';
import { tmxStore } from 'stores/tmxStore';
import { theme } from 'theme/theme';

const TMX = () => {
  const BASENAME = process.env.REACT_APP_ROUTER_BASENAME || '';

  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={tmxStore}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={responsiveFontSizes(theme)}>
            <BrowserRouter basename={BASENAME}>
              <Login />
              <MainRouter />
            </BrowserRouter>
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    </DndProvider>
  );
};

export default TMX;
