import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useStyles } from 'components/papers/standard/styles';

const StandardPaper = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Paper {...props} className={`${classes.root} ${props.className}`}>
      {children}
    </Paper>
  );
};

export default StandardPaper;
