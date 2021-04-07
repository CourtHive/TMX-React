import { createMuiTheme } from '@material-ui/core/styles';

import {
  ACTION_DISABLED,
  BACKGROUND_GREY,
  DIVIDER_GREY,
  ERROR_MAIN,
  MAIN,
  MAIN_BACKGROUND_COLOR,
  TEXT_GREY,
  TEXT_GREY_DARK,
  TEXT_MAIN,
  WHITE
} from 'theme/colors';

export const theme = createMuiTheme({
  palette: {
    background: {
      default: MAIN_BACKGROUND_COLOR,
      paper: WHITE
    },
    primary: {
      main: MAIN
    },
    grey: {
      50: TEXT_GREY_DARK,
      100: TEXT_GREY,
      200: DIVIDER_GREY,
      300: ACTION_DISABLED,
      400: BACKGROUND_GREY
    },
    action: {
      disabled: ACTION_DISABLED
    },
    error: {
      main: ERROR_MAIN
    }
  },
  typography: {
    fontFamily: "'Avenir', sans-serif",
    fontSize: 14,
    htmlFontSize: 16,
    h1: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 8
    },
    h3: {
      fontSize: 14,
      fontWeight: 400
    },
    allVariants: {
      color: TEXT_MAIN
    }
  },
  overrides: {
    MuiTab: {
      wrapper: {
        flexDirection: 'row'
      }
    }
  }
});
