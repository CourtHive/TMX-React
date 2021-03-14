import React from 'react';
import Dialog from '@material-ui/core/Dialog';

const CustomDialog = ({ children, handleOnClose, ...props }) => {
  return (
    <Dialog id={props.id} {...props} onClose={handleOnClose} aria-labelledby="custom-dialog-title">
      {children}
    </Dialog>
  );
};

export default CustomDialog;
