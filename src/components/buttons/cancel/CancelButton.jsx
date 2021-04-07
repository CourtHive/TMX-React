import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { theme } from 'components/buttons/theme';

const CancelButton = ({ ...props }) => {
  return (
    <ThemeProvider theme={theme}>
      <Button color="primary" {...props}>
        {props.children}
      </Button>
    </ThemeProvider>
  );
};

export default CancelButton;
