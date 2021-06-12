import React, { useState } from 'react';

import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';
import { makeStyles, Tooltip } from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';

export const TMXavatar = (props) => {
  const useStyles = makeStyles(() => ({
    container: {
      display: 'flex'
    },
    homePageUserAvatar: {
      backgroundColor: `#01253c!important`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: 38,
      height: '38px !important',
      flexGrow: 0,
      fontSize: 16,
      textAlign: 'center',
      color: 'white'
    }
  }));
  const classes = useStyles('#4b90d9');

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
      <Tooltip title={props.tooltip}>
        <Avatar className={classes.homePageUserAvatar} onClick={onClick}>
          {props.initial}
        </Avatar>
      </Tooltip>
    </>
  );
};

export default TMXavatar;
