import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  rootContainer: {

  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  avatar: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
  },
  editField: {
    margin: theme.spacing(1),
  },
  form: {
  },
  submit: {
    color: 'white',
    backgroundColor: blue[500],
    margin: theme.spacing(2),
    width: 200,
    '&:hover': { backgroundColor: 'green' }
  },
}));
