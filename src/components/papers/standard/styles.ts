import { makeStyles, Theme } from '@material-ui/core/styles';

import { BORDERS_GREY } from 'theme/colors';

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: BORDERS_GREY,
    boxShadow: 'none',
    padding: theme.spacing(3)
  }
}));
