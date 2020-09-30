import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  root: {
    margin: '1em',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  formControl: {
    marginTop: '1em',
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  editPanel: {
    height: '100%',
    margin: theme.spacing(3),
  },
  ratingsSlider: {
    marginTop: theme.spacing(2),
    margin: theme.spacing(1),
  },
  editField: {
    margin: theme.spacing(1),
  },
  submitInvalid: {
    color: 'white',
    backgroundColor: blue[500],
    margin: theme.spacing(2),
    width: 200,
    '&:hover': {
      backgroundColor: 'red'
    }
  },
  submit: {
    color: 'white',
    backgroundColor: blue[500],
    margin: theme.spacing(2),
    width: 200,
    '&:hover': {
      backgroundColor: 'green'
    }
  },
  gender: {
    marginTop: '.5em'
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
}));