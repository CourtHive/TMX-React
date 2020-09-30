import React from 'react';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { useStyles } from 'components/papers/standard/styles';

const StandardPaper: React.FC<PaperProps> = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Paper {...props} className={`${classes.root} ${props.className}`}>
      {children}
    </Paper>
  );
};

export default StandardPaper;
