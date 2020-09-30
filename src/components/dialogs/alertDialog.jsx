import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';

function AlertDialog() {
  const dispatch = useDispatch();
  const alertData = useSelector(state => state.tmx.visible.alertDialog);

  const handleClose = () => { dispatch({ type: 'alert dialog' }); };

  const title = alertData && alertData.title;
  const content = alertData && alertData.content;
  const cancel = alertData && alertData.cancel;
  const render = alertData && alertData.render;
  const okTitle = (alertData && alertData.okTitle) || 'Ok';
  const okFunction = () => {
    if (alertData && alertData.ok && typeof alertData.ok === 'function') {
      alertData.ok();
    }
    handleClose();
  }

  return (
    <Dialog
      open={Boolean(alertData)}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {
        !title ? null :
        <DialogTitle id="alert-dialog-title">{ title }</DialogTitle>
      }
      {
        !content ? null :
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> { content } </DialogContentText>
        </DialogContent>
      }
      { !render ? null : render() }
      <DialogActions>
        {
          !cancel ? null :
          <Button id='cancelButton' onClick={handleClose} color="primary"> Cancel </Button>
        }
        <Button id='okButton' onClick={okFunction} color="primary" autoFocus>
          {okTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;