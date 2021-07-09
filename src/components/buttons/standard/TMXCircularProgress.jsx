import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  pageProgress: {
    height: '100vh'
  },
  circularProgress: {
    color: theme.palette.primary.main
  }
}));

const TMXCircularProgress = ({ ...props }) => {
  const classes = useStyles();
  const thickness = props.thickness || 2;
  return <CircularProgress className={classes.circularProgress} thickness={thickness} {...props} />;
};

export default TMXCircularProgress;
