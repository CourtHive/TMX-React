import React from 'react';
import { useStyles } from './styles';

import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { Grid, List, ListItem, Typography } from '@material-ui/core';
import ListPopover from '../ListPopover';

interface ListSelectProps {
  items: any[];
  selectedId?: string;
  onClick?: () => void;
  onChange?: (event: any) => void;
}

const ListSelect: React.FC<ListSelectProps> = ({ items, onClick, onChange, selectedId }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const selectedItem = items.find(({ itemId }) => itemId === selectedId);
  const openPopover = (event) => setAnchorEl(event.currentTarget);
  const closePopover = () => {
    setAnchorEl(null);
  };
  const handleOnChange = (event) => {
    closePopover();
    if (typeof onChange === 'function') onChange(event);
  };
  const handleOnClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <Grid item onClick={handleOnClick}>
      <Typography className={classes.listSelectTypography} variant="h1" onClick={openPopover}>
        {selectedItem?.itemName}{' '}
        {!anchorEl ? (
          <ExpandMoreIcon className={classes.expandIcon} />
        ) : (
          <ExpandLessIcon className={classes.expandIcon} />
        )}
      </Typography>
      <ListPopover id="list-popover" open={!!anchorEl} anchorEl={anchorEl} onClose={closePopover}>
        <List>
          {items.map((currentItem) => (
            <ListItem key={currentItem.itemId} onClick={() => handleOnChange(currentItem)}>
              <Grid container direction="row" spacing={1}>
                <Grid className={classes.listItem} item>
                  <Typography>{currentItem.itemName}</Typography>
                </Grid>
                <Grid className={classes.listTick} item>
                  {currentItem.itemId === selectedId && <CheckIcon fontSize="small" style={{ top: 'unset' }} />}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </ListPopover>
    </Grid>
  );
};

export default ListSelect;
