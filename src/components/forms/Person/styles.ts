import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '1em',
    maxWidth: 500,
    width: 'auto'
  },
  minimums: { minWidth: '230px' },
  spaceLeft: { marginLeft: '1em' },
  row: {
    marginTop: '1em',
    marginBotton: '.5em'
  },
    datePicker: {
    marginTop: '1em',
    width: '100%'
  },
  divider: {
    height: '2em',
    width: '100%'
  }
}));
