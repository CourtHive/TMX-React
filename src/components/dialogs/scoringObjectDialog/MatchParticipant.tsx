import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import { useMediaQuery } from '@material-ui/core';

import SetResultInput from 'components/dialogs/scoringObjectDialog/SetResultInput';
import { useStylesCommon, useStylesMatchParticipant } from 'components/dialogs/scoringObjectDialog/styles';
import StatusDialog from 'components/dialogs/scoringObjectDialog/StatusDialog';
import {
  MatchConfigurationInterface,
  MatchParticipantStatusCategory,
  ScoringMatchUpInterface,
  StatusIconProps,
  StatusIconSideEnum
} from 'components/dialogs/scoringObjectDialog/typedefs/scoringTypes';
import { ParticipantInterface } from 'components/dialogs/scoringObjectDialog/typedefs/participantTypes';

interface MatchParticipantProps {
  isSide1: boolean;
  keyCodePressed: number;
  shiftPressed: boolean;
  gamePointsInputExists: boolean;
  participants: ParticipantInterface[];
  matchUp: ScoringMatchUpInterface;
  matchConfigParsed: MatchConfigurationInterface;
  statusCategories: MatchParticipantStatusCategory[];
  StatusDisplayFactory: React.FC<StatusIconProps>;
  setMatchUp: (matchUp: ScoringMatchUpInterface) => void;
  closeStatusDialog?: () => void;
  changeStatusCategory?: (event: React.ChangeEvent<{ name?: string; value: unknown }>, isSide1: boolean) => void;
}

const MatchParticipant: React.FC<MatchParticipantProps> = ({
  isSide1,
  keyCodePressed,
  shiftPressed,
  gamePointsInputExists,
  participants,
  matchUp,
  matchConfigParsed,
  statusCategories,
  StatusDisplayFactory,
  setMatchUp,
  closeStatusDialog,
  changeStatusCategory
}) => {
  const classesCommon = useStylesCommon();
  const classes = useStylesMatchParticipant();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setMatchUp({
      ...matchUp,
      status: {
        side1: undefined,
        side2: undefined
      }
    });
    if (closeStatusDialog) {
      closeStatusDialog();
    }
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <Grid container justify="space-between" className={classes.matchParticipantWrapper}>
      <Grid item>
        {participants?.map((participant, index) => (
          <Typography
            key={participant.id || index}
            className={`${
              participants.length === 1 ? classes.participantTypographySingle : classes.participantTypographyDouble
            } ${matches ? classes.participantTypographyFont : classes.participantTypographyFontXS}`}
          >
            {participant.firstName} {participant.lastName}
          </Typography>
        ))}
        <StatusDisplayFactory
          side={isSide1 ? StatusIconSideEnum.side1 : StatusIconSideEnum.side2}
          status={isSide1 ? matchUp.status.side1 : matchUp.status.side2}
        />
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          {matchUp.sets.map((set) => (
            <React.Fragment key={!gamePointsInputExists ? set.setNumber : `${set.setNumber}-game-points`}>
              <SetResultInput
                isSide1={isSide1}
                keyCodePressed={keyCodePressed}
                shiftPressed={shiftPressed}
                set={set}
                matchUp={matchUp}
                value={isSide1 ? set.side1 : set.side2}
                matchConfigParsed={matchConfigParsed}
                setMatchUp={setMatchUp}
                openStatusDialog={handleOpen}
              />
              {set.tiebreak && set.isActive && (
                <SetResultInput
                  isSide1={isSide1}
                  keyCodePressed={keyCodePressed}
                  shiftPressed={shiftPressed}
                  set={set}
                  isTiebreak={true}
                  matchUp={matchUp}
                  value={isSide1 ? set.tiebreak.side1 : set.tiebreak.side2}
                  matchConfigParsed={matchConfigParsed}
                  setMatchUp={setMatchUp}
                />
              )}
              {set.gameResult && !set.isTiebreakSet && !matchConfigParsed.timed && (
                <SetResultInput
                  isSide1={isSide1}
                  isGamePointInput={true}
                  keyCodePressed={keyCodePressed}
                  shiftPressed={shiftPressed}
                  set={set}
                  matchUp={matchUp}
                  value={isSide1 ? set.gameResult.side1 : set.gameResult.side2}
                  matchConfigParsed={matchConfigParsed}
                  setMatchUp={setMatchUp}
                />
              )}
            </React.Fragment>
          ))}
          <Grid
            item
            className={
              matches
                ? `${classesCommon.setEntry} ${classes.moreHorizontalIconWrapper}`
                : `${classesCommon.setEntryXS} ${classes.moreHorizontalIconWrapperXS}`
            }
          >
            <StatusDialog
              isOpen={open}
              isSide1={isSide1}
              categories={statusCategories}
              StatusDisplayFactory={StatusDisplayFactory}
              status={isSide1 ? matchUp.status.side1 : matchUp.status.side2}
              setTo={matchConfigParsed?.setFormat?.setTo}
              matchUp={matchUp}
              setMatchUp={setMatchUp}
              openDialog={handleOpen}
              closeDialog={handleClose}
              applyStatus={handleApply}
              changeStatusCategory={changeStatusCategory}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MatchParticipant;
