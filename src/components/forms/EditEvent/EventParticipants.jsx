import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from '@material-ui/core';
import { AvailableParticipants } from 'components/tables/AvailableParticipants';

export function AddParticipantsDrawer(props) {
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.tmx.visible.drawer);
  const closeDrawer = () => {
    dispatch({ type: 'visible drawer', payload: undefined });
  };
  return (
    <Drawer anchor="right" open={drawer === 'addEventParticipants'} onClose={closeDrawer}>
      <AvailableParticipants callback={closeDrawer} {...props} />
    </Drawer>
  );
}
