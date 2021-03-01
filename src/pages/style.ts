import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    tabbar: {
      fontSize: '18px',
      borderBottom: '1px solid #e8e8e8'
    },
    tab: {
      minWidth: '80px !important'
      // textTransform: 'none !important'
    }
  })
);
