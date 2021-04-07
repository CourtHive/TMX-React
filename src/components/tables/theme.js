import { createMuiTheme } from '@material-ui/core/styles';
export const theme = createMuiTheme({
  overrides: {
    // MuiOutlinedInput: { input: { padding: '10px 15px' } },
    MuiOutlinedInput: { input: { padding: '14px 18px' } },
    MuiTableRow: {
      root: {
        'font-size': '15px',
        '&:hover': {
          backgroundColor: 'white'
        }
      }
    },
    MuiTableCell: {
      root: {
        '&:hover': {
          backgroundColor: 'white'
        },
        'font-size': '15px'
        // padding: '0px'
      }
    },
    MuiSelect: {
      root: {}
    },
    MuiInputBase: {
      root: { margin: '8px' },
      input: { 'font-size': '15px' }
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
