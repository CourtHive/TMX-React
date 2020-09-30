import React from 'react';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { useStyles } from 'components/papers/notice/styles';

const NoticePaper: React.FC<PaperProps> = ({ children, ...props }) => {
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
