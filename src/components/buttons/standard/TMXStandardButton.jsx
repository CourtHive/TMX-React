import Button from '@material-ui/core/Button';

import { useStyles } from 'components/buttons/standard/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from 'components/buttons/theme';

import TMXCircularProgress from './TMXCircularProgress';

const TMXStandardButton = ({ children, loading, ...props }) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button className={classes.button} color="primary" {...props}>
        {loading ? <TMXCircularProgress className={classes.loader} size={18} /> : { children }}
      </Button>
    </ThemeProvider>
  );
};

export default TMXStandardButton;
