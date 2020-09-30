import React from 'react';

import { Button } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { useStyles } from 'components/buttons/style';

export const AddGroupingButton = (props) => {
  const classes = useStyles();
  const { onClick, label } = props;

  return (
    <Button startIcon={<AddBoxIcon />} className={classes.button} variant='outlined' onClick={onClick}>
      {label}
    </Button>
  );
};
