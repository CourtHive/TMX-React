import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  sectionTitle: {
    marginBottom: '1em',
  },
  divider: {
    height: '2em',
    width: '100%'
  },
  cardRoot: {
    width: '100%',
  },
  media: {
    minWidth: 300,
    width: '100%',
    height: '100%',
  },
}));
