import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { useMediaQuery } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';

import { useStyles } from 'components/tournament/styles';
import { getLogo } from 'services/imageHandlers/getImage';

import SPLASH from 'images/splash.png';

const TournamentLogo = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const [images, setImages] = useState(['']);
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const keyLoads = useSelector((state: any) => state.tmx.keyLoads);

  const handleOnClick = () => {
    if (props.onClick) props.onClick();
  };

  useEffect(() => {
    (async () => {
      const logo = await getLogo();
      setImages([logo]);
    })();
  }, [setImages, keyLoads]);

  return (
    <Grid container direction="row" justify="center">
      <Grid container spacing={2}>
        {images.map((src, index) => (
          <React.Fragment key={index}>
            <img
              src={src || SPLASH}
              alt="logo"
              className={!downSm ? classes.menuImage : classes.menuImageXs}
              onClick={handleOnClick}
            />
            {index !== images.length - 1 && <Divider className={classes.logoDivider} orientation="vertical" flexItem />}
          </React.Fragment>
        ))}
      </Grid>
    </Grid>
  );
};

export default TournamentLogo;
