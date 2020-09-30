import React from 'react';
import { Button } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';

import { useStyles } from 'components/buttons/style';
import { context } from 'services/context';

export const PrintButton = () => {
  const classes = useStyles();
  const producePDF = (event) => {
    context.ee.emit('contextPDF', { event });
  };
  return (
    <Button startIcon={<PrintIcon />} className={classes.button} variant="outlined" onClick={producePDF}>
      PDF
    </Button>
  );
};
