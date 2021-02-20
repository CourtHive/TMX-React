import React from 'react';
import Popover, { PopoverProps } from '@material-ui/core/Popover';

const ListPopover: React.FC<PopoverProps> = ({ children, ...props }) => {
  return (
    <Popover
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      {children}
    </Popover>
  );
};

export default ListPopover;
