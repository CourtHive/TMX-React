import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
  scoreEntry: {
    margin: theme.spacing(1),
    fontSize: 14,
    padding: '5px',
    border: '2px solid #ced4da'
  },
  currentRow: {
    margin: theme.spacing(1),
    background: '#D3D3D3',
    fontSize: 15,
    padding: '5px',
    border: '2px solid green'
  }
}));
