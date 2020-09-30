import React from 'react';

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import SvgIcon from '@material-ui/core/SvgIcon';
import { useStylesCommon } from 'components/scheduleDisplay/styles';

interface UMTableDragHandleCellProps {
  courtId?: boolean;
}

const UMTableDragHandleCell: React.FC<UMTableDragHandleCellProps> = ({ courtId }) => {
  const classes = useStylesCommon();

  return (
    <div className={classes.UMTableDragHandleCellWrapper}>
      <SvgIcon
        className={`${classes.UMTableDragHandleCell}${courtId ? ` ${classes.UMTableDragHandleCellAssigned}` : ''}`}
        component={DragIndicatorIcon}
      />
    </div>
  );
};

export default UMTableDragHandleCell;
