import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useStyles } from 'components/tables/common/styles';

interface CheckboxCellProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean, row: any) => void;
  disabled?: boolean;
  row: any;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({ onChange, disabled, row }) => {
  const classes = useStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange(event, checked, row);
  };
  return (
    <Checkbox checked={row.checked} disabled={disabled} className={classes.EPCheckbox} onChange={handleOnChange} />
  );
};

export default CheckboxCell;
