import React from 'react';

import Typography from '@material-ui/core/Typography';

import { useStylesCommon } from 'components/scheduleDisplay/styles';
import { UMScheduleTableDataType } from 'components/scheduleDisplay/UpcomingMatchesCourtSchedule';

interface UMCourtScheduleFirstColumnCellProps {
  data?: UMScheduleTableDataType;
  text?: string;
}

const UMCourtScheduleFirstColumnCell: React.FC<UMCourtScheduleFirstColumnCellProps> = ({ data, text }) => {
  const classes = useStylesCommon();
  const padding =
    data.id === '1' || (data.id === '2' && data?.courts?.find((court) => court?.matchUp)) ? '62px 0' : '12px 0';
  return (
    <div className={classes.firstColumn} style={{ padding: padding }}>
      <div>{text ? <Typography className={classes.firstColumnText}>{text}</Typography> : null}</div>
    </div>
  );
};

export default UMCourtScheduleFirstColumnCell;
