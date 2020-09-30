import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  selector: {
    background: theme.palette.background.paper,
    '&:hover': {
      borderColor: '#fff'
    }
  }
}))