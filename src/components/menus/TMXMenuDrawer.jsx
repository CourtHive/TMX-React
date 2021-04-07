import React, { useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  danger: { color: 'red' },
  warning: { color: 'orange' },
  success: { color: 'green' },
  primary: { color: 'blue' },
  icon: { minWidth: 30, flexShrink: 0 },
  list: { minWidth: 180, width: 'auto' },
  fullList: { width: 'auto' },
  divider: { marginTop: '1em' },
  headerPrimary: {
    fontWeight: 'bold',
    fontSize: 'larger',
    marginRight: 40,
    whiteSpace: 'nowrap'
  }
});

/*
  MenuDrawer is able to construct a menu given an array of items that can be of four types
  1. Header item, no onClick function
  2. Standard menu item with an onClick function
  3. SubMenu item which loads a subMenu
  4. Menu Item which sets a new root menu

  All menu items can have an intent: 'danger', 'success', or 'primary'
  Menu items can be disabled or ignored (not generated)
*/

export function MenuDrawer(props) {
  const { anchor = 'left', menuItems: originalItems = [], open, onClose } = props || {};
  const [rootMenuItems, setRootMenuItems] = useState(originalItems);
  const [menuItems, setMenuItems] = useState(originalItems);
  const classes = useStyles();

  function setSubMenu(subMenuItems) {
    setMenuItems(subMenuItems);
  }
  function setRootMenu() {
    setMenuItems(rootMenuItems);
  }
  const CustomDivider = ({ menuItem, index }) => {
    const colorClass = menuItem.intent && classes[menuItem.intent];
    return (
      <div>
        {index ? <Divider className={classes.divider} /> : null}
        <ListItem className={menuItem.className}>
          {!menuItem.icon ? null : (
            <ListItemIcon classes={{ root: classes.icon }} className={colorClass}>
              {' '}
              {menuItem.icon}{' '}
            </ListItemIcon>
          )}
          <ListItemText
            classes={{ primary: classes.headerPrimary, secondary: classes.headerSecondary }}
            primary={menuItem.title}
          />
        </ListItem>
      </div>
    );
  };

  const CustomInput = ({ menuItem }) => {
    const [value, setValue] = useState();
    const colorClass = menuItem.intent && classes[menuItem.intent];
    const onChange = (event) => {
      setValue(event.target.value);
    };

    const onKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (menuItem.onSubmit && typeof menuItem.onSubmit === 'function') {
          menuItem.onSubmit(value);
        }
        onClose();
      }
    };

    return (
      <ListItem dense={true} button className={menuItem.className} disabled={menuItem.disabled}>
        {!menuItem.icon ? null : (
          <ListItemIcon classes={{ root: classes.icon }} className={colorClass}>
            {' '}
            {menuItem.icon}{' '}
          </ListItemIcon>
        )}
        <TextField onChange={onChange} onKeyPress={onKeyPress} />
      </ListItem>
    );
  };

  const CustomMenuItem = ({ menuItem }) => {
    const colorClass = menuItem.intent && classes[menuItem.intent];
    const clickAction = () => {
      menuItem.onClick();
      onClose();
      setRootMenu();
    };
    const subMenu = () => {
      if (typeof menuItem.subMenu === 'function') {
        menuItem.subMenu().then(
          (subMenuItems) => setSubMenu(subMenuItems),
          (err) => console.log(err)
        );
      } else if (Array.isArray(menuItem.subMenu)) {
        setSubMenu(menuItem.subMenu);
      }
    };

    const newRootMenu = () => {
      if (menuItem.newRoot) {
        setRootMenuItems(menuItem.newRoot);
        setMenuItems(menuItem.newRoot);
      }
    };

    const onClick =
      (menuItem.onClick && clickAction) ||
      (menuItem.subMenu && subMenu) ||
      (menuItem.newRoot && newRootMenu) ||
      (menuItem.rootMenu && setRootMenu);

    return (
      <ListItem
        id={menuItem.id}
        dense={true}
        button
        onClick={onClick}
        classes={{ root: menuItem.className }}
        disabled={menuItem.disabled}
      >
        {!menuItem.icon ? null : (
          <ListItemIcon classes={{ root: classes.icon }} className={colorClass}>
            {' '}
            {menuItem.icon}{' '}
          </ListItemIcon>
        )}
        <ListItemText classes={{ primary: colorClass }} primary={menuItem.title} />
      </ListItem>
    );
  };

  const itemList = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom'
      })}
    >
      <List>
        {menuItems
          .filter((menuItem) => !menuItem.ignore)
          .map((menuItem, i) => {
            return (
              <div key={`mainMenu${i}`}>
                {menuItem.divider ? (
                  <CustomDivider menuItem={menuItem} index={i} />
                ) : menuItem.input ? (
                  <CustomInput menuItem={menuItem} />
                ) : (
                  <CustomMenuItem menuItem={menuItem} />
                )}
              </div>
            );
          })}
      </List>
    </div>
  );

  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      {itemList(anchor)}
    </Drawer>
  );
}
