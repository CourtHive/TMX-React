import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  tab: {
    minWidth: '40px!important',
    fontSize: '14px!important',
    textTransform: 'none'
    //     padding: '0 12px'
  },
  tabSm: {
    minWidth: '40px!important',
    fontSize: '12px!important'
  }
}));

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <Typography
      component={'div'}
      role={'tabpanel'}
      hidden={value !== index}
      id={`scrollable-tmx-tabpanel-${index}`}
      aria-labelledby={`scrollable-tmx-tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes.tabPanel}>{children}</Box>}
    </Typography>
  );
};
