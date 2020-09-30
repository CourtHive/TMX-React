import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';

import { useStyles } from 'components/buttons/standard/styles';
import { theme } from 'components/buttons/theme';

const TMXStandardButton: React.FC<ButtonProps> = ({ ...props }) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button className={classes.button} color="primary" {...props}>
        {props.children}
      </Button>
    </ThemeProvider>
  );
};

export default TMXStandardButton;
