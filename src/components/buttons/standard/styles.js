import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  button: {
    border: `1px solid ${theme.palette.grey['300']}`,
    '& > span': {
      textTransform: 'initial'
    }
  }
}));
