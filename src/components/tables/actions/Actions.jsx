import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from 'components/tables/actions/styles';

/*
interface IconProps {
  icon: any;
  onClick?: (index) => void;
}
*/

const Actions = ({ dataImgSelector, actions, style }) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.actionsWrapper}
      container
      data-img-selector={dataImgSelector}
      direction="row"
      spacing={1}
      style={style}
    >
      {actions &&
        actions.map((action, key) => (
          <Grid key={key} data-img-selector={dataImgSelector} item>
            {action}
          </Grid>
        ))}
    </Grid>
  );
};

export default Actions;
