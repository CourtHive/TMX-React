import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1em',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));
