import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select from '@material-ui/core/Select';
import { TMXInput } from 'components/inputs/TMXInput';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selector: {
    background: theme.palette.background.paper,
    '&:hover': {
      borderColor: '#fff'
    }
  }
}));

const TMXSelect = ({ children, ...props }) => {
  const classes = useStyles();
  const renderIcon = (props) => <ExpandMoreIcon {...props} fontSize="small" style={{ top: 'unset' }} />;
  return (
    <Select
      className={`${classes.selector}${props.className && ` ${props.className}`}`}
      input={<TMXInput />}
      IconComponent={renderIcon}
      {...props}
    >
      {children}
    </Select>
  );
};

export default TMXSelect;
