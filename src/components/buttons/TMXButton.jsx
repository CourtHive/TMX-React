import React from 'react';

import Grid from '@material-ui/core/Grid';
import { useStyles } from 'components/buttons/standard/styles';
import TMXStandardButton from 'components/buttons/standard/TMXStandardButton';

export const TMXButton = (props) => {
  const classes = useStyles();
  const { title, icon } = props;
  return (
    <Grid className={classes.menuRightSubWrapper} item>
      <TMXStandardButton {...props} >
        {title || null}
        {icon || null}
      </TMXStandardButton>
    </Grid>
  )
}

export default TMXButton;