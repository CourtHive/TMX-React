import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select from '@material-ui/core/Select';
import { useStyles } from 'components/selectors/tmxSelector/styles';
import { TMXBaseInput } from 'components/inputs/TMXBaseInput';

const TMXSelect = ({ children, ...props }) => {
  const classes = useStyles();
  const renderIcon = (props) => <ExpandMoreIcon {...props} fontSize="small" style={{ top: 'unset' }} />;
  return (
    <Select
      className={`${classes.selector}${props.className && ` ${props.className}`}`}
      input={<TMXBaseInput />}
      IconComponent={renderIcon}
      {...props}
    >
      {children}
    </Select>
  );
};

export default TMXSelect;
