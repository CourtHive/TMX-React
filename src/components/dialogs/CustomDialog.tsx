import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogProps } from '@material-ui/core/Dialog/Dialog';

interface CustomDialogProps extends DialogProps {
  handleOnClose: () => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ children, handleOnClose, ...props }) => {
  return (
    <Dialog id={props.id} {...props} onClose={handleOnClose} aria-labelledby="scoring-dialog-title">
      {children}
    </Dialog>
  );
};

export default CustomDialog;
