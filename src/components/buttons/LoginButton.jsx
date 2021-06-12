import React from 'react';
import { useDispatch } from 'react-redux';

import LockOpenIcon from '@material-ui/icons/LockOpen';
import { IconButton, Tooltip } from '@material-ui/core/';

export function LoginButton() {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch({ type: 'login modal', payload: true });
  };
  return (
    <>
      {
        <Tooltip title="Login">
          <IconButton edge="end" color="inherit" aria-label="login" onClick={onClick}>
            <LockOpenIcon />
          </IconButton>
        </Tooltip>
      }
    </>
  );
}
