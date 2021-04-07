import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useStyles } from 'components/papers/notice/styles';

const NoticePaper = ({ children, ...props }) => {
  const classes = useStyles();
  let className = classes.root;
  if (props.className) className += ` ${classes[props.className]}`;
  // let className = `${classes.root} ${classes[props.className]}`;
  return (
    <Paper {...props} className={className}>
      {children}
    </Paper>
  );
};

export default NoticePaper;
