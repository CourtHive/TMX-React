import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: '1px solid #ced4da',
    borderRadius: 2,
    '& button': {
      margin: 0
    }
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    fontSize: 16,
    padding: `${theme.spacing(1)}px 26px ${theme.spacing(1)}px 12px`,
    position: 'relative',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 2,
      backgroundColor: theme.palette.background.paper
    }
  }
}));
