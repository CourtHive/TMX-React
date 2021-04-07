import React, { useState } from 'react';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
import TMXButton from './TMXButton';

export const TMXMenuButton = (props) => {
  const [anchorEl, setAnchorEl] = useState();

  const onClick = (event) => {
    if (props.onClick) {
      props.onClick();
    } else if (props.menuItems) {
      setAnchorEl(event.currentTarget);
    }
  };
  const onClose = () => setAnchorEl(null);

  return (
    <>
      <TMXPopoverMenu
        menuItems={props.menuItems}
        menuHeader={props.menuHeader}
        menuStyle={props.menuStyle}
        anchor={anchorEl}
        open={anchorEl}
        closeMenu={onClose}
      />
      <TMXButton title={props.title} id={props.id} onClick={onClick} />
    </>
  );
};

export default TMXMenuButton;
