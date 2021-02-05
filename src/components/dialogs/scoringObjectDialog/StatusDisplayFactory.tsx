import React from 'react';

import CheckIcon from '@material-ui/icons/Check';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { useStylesMatchParticipant } from 'components/dialogs/scoringObjectDialog/styles';
import { StatusIconProps } from 'components/dialogs/scoringObjectDialog/typedefs/scoringTypes';

const StatusDisplayFactory: React.FC<StatusIconProps> = ({ displayAsIcon, disabled, side, status, onClick }) => {
  const classesMatchParticipants = useStylesMatchParticipant();

  const handleOnClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const statusIconFactory = () => {
    switch (status?.matchUpStatusCodeDisplay) {
      case 'Winner':
        return (
          <CheckIcon
            id={`check-icon-${side}`}
            fontSize="small"
            className={
              disabled
                ? classesMatchParticipants.moreHorizontalIconDisabled
                : classesMatchParticipants.moreHorizontalIcon
            }
            onClick={handleOnClick}
          />
        );
      default:
        return (
          <MoreHorizIcon
            id={`more-horizontal-icon-${side}`}
            fontSize="small"
            className={
              disabled
                ? classesMatchParticipants.moreHorizontalIconDisabled
                : classesMatchParticipants.moreHorizontalIcon
            }
            onClick={handleOnClick}
          />
        );
    }
  };

  const statusNextToParticipantFactory = () => {
    return (
      <>
        {status?.matchUpStatusCodeDisplay !== 'Winner' && status?.matchUpStatusCodeDisplay !== 'None' && (
          <div
            id={`${status?.matchUpStatusCodeDisplay}-${side}`}
            onClick={onClick}
            className={classesMatchParticipants.textualStatus}
          >
            {status?.matchUpStatusCodeDisplay && `(${status?.matchUpStatusCodeDisplay})`}
          </div>
        )}
      </>
    );
  };

  return displayAsIcon ? statusIconFactory() : statusNextToParticipantFactory();
};

export default StatusDisplayFactory;
