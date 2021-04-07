import { makeStyles } from '@material-ui/core/styles';

import { BORDERS_GREY } from 'theme/colors';

export const useStyles = makeStyles((theme) => ({
  root: {
    border: BORDERS_GREY,
    boxShadow: 'none',
    padding: theme.spacing(3)
  },
  info: {
    backgroundColor: '#C2DFFF'
  },
  header: {
    backgroundColor: '#F6F6F6'
  }
}));
