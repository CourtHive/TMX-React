import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  select: {
    margin: theme.spacing(1)
  },
  iconMargin: {
    marginRight: '.5em'
  },
}));