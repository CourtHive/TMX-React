import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  select: {
    height: '36px'
  },
  selectEmpty: { marginTop: theme.spacing(2) },
  formControl: {
    marginTop: '1em',
    margin: theme.spacing(1),
    minWidth: 120
  },
  formControlNumber: {
    marginTop: '1em',
    margin: theme.spacing(1),
    minWidth: 120
  }
}));
