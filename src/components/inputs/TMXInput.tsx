import React from 'react';

import Input from '@material-ui/core/Input';
import { InputProps } from '@material-ui/core';
import { useStyles } from 'components/inputs/styles';

const TMXInput: React.FC<InputProps> = ({ ...props }) => {
  const classes = useStyles();
  return (
    <Input
      {...props}
      className={`${classes.root}${props.className ? ` ${props.className}` : ''}`}
      disableUnderline
      inputProps={{ className: classes.input, ...props.inputProps }}
    />
  );
};

export default TMXInput;
