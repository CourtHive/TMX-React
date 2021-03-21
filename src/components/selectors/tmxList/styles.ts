import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
  listSelectTypography: {
    fontSize: 15,
    marginBottom: 0,
    paddingLeft: 10
  },
  listItem: {
    minWidth: 33,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  listTick: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  expandIcon: {
    height: 18,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));
