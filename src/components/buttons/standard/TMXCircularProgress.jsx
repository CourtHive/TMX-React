import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useStyles } from 'components/progress/styles';

const TMXCircularProgress = ({ ...props }) => {
  const classes = useStyles();
  const thickness = props.thickness || 2;
  return <CircularProgress className={classes.circularProgress} thickness={thickness} {...props} />;
};

export default TMXCircularProgress;
