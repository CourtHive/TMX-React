import { createMuiTheme } from '@material-ui/core/styles';
export const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      root: {
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
      root: {
        'font-size': '15px'
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px 18px'
      }
    },
    MuiTypography: {
      h6: {
        'font-size': '2rem'
      }
    },
    MuiInputBase: {
      root: {
        margin: '8px'
      },
      input: {
        'font-size': '15px'
      }
    },
    MuiButton: {
      label: {
        'font-size': '14px'
      }
    }
  }
});
