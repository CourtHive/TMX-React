import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useStyles } from 'components/tables/common/styles';

const CheckboxCell = ({ onChange, disabled, row }) => {
  const classes = useStyles();
  const handleOnChange = (event, checked) => {
    onChange(event, checked, row);
  };
  return (
    <Checkbox checked={row.checked} disabled={disabled} className={classes.EPCheckbox} onChange={handleOnChange} />
  );
};

export default CheckboxCell;
