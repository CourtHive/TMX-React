import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

export function MainMenuButton() {
  const dispatch = useDispatch();
  const iconTabs = useSelector((state) => state.tmx.visible.iconTabs);

  const toggleTabIcons = () => {
    dispatch({ type: 'set icon tabs', payload: !iconTabs });
  };

  const fab = {
    icon: <MenuIcon />,
    label: 'Edit'
  };

  return (
    <>
      <IconButton aria-label={fab.label} className={fab.className} color={fab.color} onClick={toggleTabIcons}>
        {fab.icon}
      </IconButton>
    </>
  );
}

export default MainMenuButton;
