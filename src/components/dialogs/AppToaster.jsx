import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const AppToaster = () => {
  const dispatch = useDispatch();
  const toasterState = useSelector(state => state.tmx.toasterState);
  const anchorOrigin = toasterState && toasterState.anchorOrigin;
  const handleClose = (_, reason) => {
    if (reason === 'clickaway') { return; }
    dispatch({ type: 'toaster state' });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={Boolean(toasterState && toasterState.visible)}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={toasterState.severity || "success"}>
          {toasterState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppToaster;