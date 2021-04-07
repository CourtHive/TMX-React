import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './styles';

const TieTeam = ({ /*importLineup,*/ justifyContent, teamLogo, teamName, sideNumber }) => {
  const classes = useStyles();
  const textAlign = sideNumber === 1 ? 'right' : 'left';

  const logo = (
    <Grid className={classes.teamGridItem} item>
      <Grid alignItems="center" container>
        <img alt="team-logo" className={classes.teamLogo} src={teamLogo} />
      </Grid>
    </Grid>
  );

  const teamDetails = (
    <Grid className={classes.teamGridItem} item>
      <Grid alignContent="center" container direction="column">
        <Grid item>
          <Typography align={textAlign} className={classes.teamName}>
            {teamName}
          </Typography>
        </Grid>
        {/*<Grid item>*/}
        {/*  <Typography align={textAlign} onClick={importLineup} className={classes.teamActionButton}>*/}
        {/*    Import lineup*/}
        {/*  </Typography>*/}
        {/*</Grid>*/}
      </Grid>
    </Grid>
  );

  return (
    <Grid alignContent="center" className={classes.tieTeamContainer} container direction="row" justify={justifyContent}>
      {sideNumber === 1 ? teamDetails : teamLogo && logo}
      {sideNumber === 1 ? teamLogo && logo : teamDetails}
    </Grid>
  );
};

export default TieTeam;
