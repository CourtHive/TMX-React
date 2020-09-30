import React from 'react';

import CheckIcon from '@material-ui/icons/Check';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { useStylesMatchParticipant } from 'components/dialogs/scoringDialog/styles';
import { StatusIconProps } from 'components/dialogs/scoringDialog/typedefs/scoringTypes';

const StatusDisplayFactory: React.FC<StatusIconProps> = ({ displayAsIcon, disabled, side, status, onClick }) => {
  const classesMatchParticipants = useStylesMatchParticipant();

  const handleOnClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const statusIconFactory = () => {
    switch (status.tdmCode) {
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
        {status.tdmCode !== 'Winner' && status.tdmCode !== 'None' && (
          <div id={`${status.tdmCode}-${side}`} onClick={onClick} className={classesMatchParticipants.textualStatus}>
            ({status.tdmCode})
          </div>
        )}
      </>
    );
  };

  return displayAsIcon ? statusIconFactory() : statusNextToParticipantFactory();
};

export default StatusDisplayFactory;
