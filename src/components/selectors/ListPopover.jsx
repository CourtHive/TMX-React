import React from 'react';
import Popover from '@material-ui/core/Popover';

const ListPopover = ({ children, ...props }) => {
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
