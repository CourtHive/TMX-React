import React from 'react';

import Grid from '@material-ui/core/Grid';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useStylesCommon } from 'components/scheduleDisplay/styles';
import { UMTableDataType } from 'components/scheduleDisplay/UpcomingMatchesCourtSchedule';

interface SideCellProps {
  isSide1?: boolean;
  rowItem: UMTableDataType;
  handleCellClick?: any;
}

const SideCell: React.FC<SideCellProps> = ({ isSide1, rowItem, handleCellClick }) => {
  const classes = useStylesCommon();
  const { matchUpId } = rowItem;
  const participantId = isSide1 ? rowItem.side1Id : rowItem.side2Id;
  const checkedIn = rowItem.checkedInParticipantIds?.includes(participantId);
  const onClick = () => handleCellClick && handleCellClick({ matchUpId, participantId });

  return (
    <Grid container spacing={2} onClick={onClick}>
      <Grid item>{isSide1 ? rowItem.side1 : rowItem.side2}</Grid>
      {checkedIn ? <CheckCircleIcon className={classes.checkInFilled} /> : null}
    </Grid>
  );
};

export default SideCell;
