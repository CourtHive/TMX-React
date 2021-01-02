import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core/';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

export const TMXIconButton = (props) => {
  const [anchorEl, setAnchorEl] = useState();

  const { color } = props;
  const iconColor = color || 'inherit';

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
      <Tooltip title={props.title || ''} aria-label={props.aria || ''}>
        <IconButton
          id={props.id}
          edge="start"
          color={iconColor}
          style={props.style}
          className={props.className}
          aria-label={props.aria}
          onClick={onClick}
        >
          {props.icon}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default TMXIconButton;
