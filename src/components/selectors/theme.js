import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  overrides: {
    MuiSelect: {
      root: {
        'font-size': '15px'
      }
    },
    MuiInputBase: {
      root: {
        margin: '8px',
        'font-size': '15px'
      },
      input: { 'font-size': '15px' }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px 18px',
        'font-size': '15px'
      }
    },
    MuiTypography: {
      h6: {
        'font-size': '2rem'
      }
    },
    MuiButton: {
      label: {
        'font-size': '14px'
      }
    }
  }
});
