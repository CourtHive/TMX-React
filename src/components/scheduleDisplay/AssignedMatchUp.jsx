import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { env } from 'config/defaults';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { useStylesCommon } from 'components/scheduleDisplay/styles';

import { utilities } from 'tods-competition-factory';
const { convertTime, DateHHMM } = utilities.dateTime;

const UpcomingMatchUpsActions = ({ courtId, removeAssignment, rowData }) => {
  const classes = useStylesCommon();
  const editState = useSelector((state) => state.tmx.editState);

  const court = rowData?.courts?.find((currentCourt) => currentCourt.courtId === courtId);
  const [cellMenuEl, setCellMenuEl] = useState();
  const matchUp = court.matchUp;
  const { matchUpId } = matchUp || {};

  const handleCloseCellMenu = () => {
    setCellMenuEl(null);
  };

  const handleCellClick = (event) => {
    editState && setCellMenuEl(event.currentTarget);
  };

  const handleMenuSelection = (selection) => {
    setCellMenuEl(null);
    if (selection === 'remove') return removeAssignment && removeAssignment(matchUpId);
  };

  return (
    <Grid className={classes.resourceWrapper} container>
      {!matchUp ? null : (
        <>
          <AssignedMatchUp matchUp={matchUp} onClick={handleCellClick} />
          <Popover
            id={matchUp.id}
            open={!!cellMenuEl}
            anchorEl={cellMenuEl}
            onClose={handleCloseCellMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Typography className={classes.cellMenu} onClick={() => handleMenuSelection('remove')}>
              Remove
            </Typography>
          </Popover>
        </>
      )}
    </Grid>
  );
};

// const OpenCourt: React.FC = () => {
//   const classes = useStylesCommon();
//   return <div className={`${classes.emptyResourceWrapper} ${classes.lightGreenBackground}`}>Open Court</div>;
// };

export const AssignedMatchUp = ({ className, matchUp, onClick }) => {
  const classes = useStylesCommon();
  const time = matchUp?.schedule?.time; // TODO: convert time string to e.g. 1h 54m ?
  const scheduledTime = convertTime(DateHHMM(matchUp.schedule.scheduledTime), env) || '';
  const liveTime = time !== '00:00:00' ? 'LIVE 54m' : scheduledTime;
  return matchUp ? (
    <Grid className={`${classes.matchContainer}${className ? ` ${className}` : ''}`} onClick={onClick}>
      <Grid container direction="column" justify={'space-between'}>
        <Grid item>
          <Typography className={classes.liveTimeTypography}>{liveTime}</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.eventNameTypography}>{matchUp.eventName}</Typography>
        </Grid>
      </Grid>
      <Grid item={true} xs={12} className={classes.side1Side2Typography}>
        {matchUp.side1}
      </Grid>
      <Grid item={true} xs={12} className={classes.side1Side2Typography}>
        vs
      </Grid>
      <Grid item={true} xs={12} className={classes.side1Side2Typography}>
        {matchUp.side2}
      </Grid>
    </Grid>
  ) : null;
};

export default UpcomingMatchUpsActions;
