import React from 'react';

import { Checkbox, Divider, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export const useStyles = makeStyles(() => ({
  danger: { color: 'red' },
  warning: { color: 'orange' },
  success: { color: 'green' },
  primary: { color: 'blue' },
  icon: { marginRight: '1em', minWidth: 30, flexShrink: 0 },
  label: {
    verticalAlign: 'middle'
  },
  headerPrimary: {
    fontWeight: 'bold',
    fontSize: 'larger'
  },
  '&.Mui-selected': {
    outline: 'none'
  },
  '&:hover': {
    outline: 'none'
  },
  checkbox: {
    width: '30px'
  }
}));

export function TMXPopoverMenu({ anchor, open, menuPosition, menuItems = [], menuHeader, closeMenu, menuStyle }) {
  const classes = useStyles();
  const root = document.getElementById('root');
  const anchorEl = anchor || root;
  const anchorReference = menuPosition ? 'anchorPosition' : 'anchorEl';

  const MenuItems = menuItems
    .filter((menuItem) => !menuItem.ignore)
    .map((menuItem, index) => {
      if (menuItem.divider) {
        return <Divider key={`menuDivider${index}`} />;
      }
      const hasCheckBox = menuItem.checked !== undefined;
      const checkBox = hasCheckBox && <Checkbox checked={menuItem.checked} className={classes.checkbox} />;
      const icon = menuItem.icon && <div className={classes.icon}>{menuItem.icon}</div>;
      const colorClass = menuItem.intent && classes[menuItem.intent];

      const onClick = () => {
        if (menuItem.onClick) {
          menuItem.onClick({ id: menuItem.id, key: menuItem.key });
          closeMenu();
        }
      };

      const key = menuItem.key || menuItem.id || menuItem.text;
      return (
        <MenuItem id={menuItem.id} key={key} onClick={onClick} className={colorClass}>
          {checkBox}
          {icon}
          <div className={classes.label}>{menuItem.text}</div>
        </MenuItem>
      );
    });

  const menuOpen = Boolean(open && (menuPosition || anchor) && Array.isArray(MenuItems) && MenuItems.length);

  return (
    <>
      <Menu
        id="menu-popover"
        anchorEl={anchorEl}
        keepMounted
        anchorReference={anchorReference}
        anchorPosition={menuPosition}
        open={menuOpen}
        onClose={closeMenu}
        PaperProps={{ style: menuStyle }}
      >
        {!menuHeader ? null : (
          <ListItem style={{ outline: 'none' }}>
            <ListItemText
              classes={{ primary: classes.headerPrimary, secondary: classes.headerSecondary }}
              primary={menuHeader.primary}
              secondary={menuHeader.secondary}
            />
          </ListItem>
        )}
        {menuHeader ? <Divider /> : null}
        {MenuItems}
      </Menu>
    </>
  );
}
