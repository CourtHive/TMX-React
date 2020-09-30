import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  },
  breadcrumb: {
    display: 'flex',
    fontSize: 16,
    marginBottom: '1em'
  },
  tmxDraws: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    // alignItems: 'center'
  },
  drawMatchTitle: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 600
  }
}));
