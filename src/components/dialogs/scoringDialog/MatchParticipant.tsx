import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import { useMediaQuery } from '@material-ui/core';

import SetResultInput from 'components/dialogs/scoringDialog/SetResultInput';
import { useStylesCommon, useStylesMatchParticipant } from 'components/dialogs/scoringDialog/styles';
import StatusDialog from 'components/dialogs/scoringDialog/StatusDialog';
import {
  MatchConfigurationInterface,
  ScoringMatchUpInterface,
  MatchParticipantStatusCategory,
  StatusIconProps,
  StatusIconSideEnum
} from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import { ParticipantInterface } from 'components/dialogs/scoringDialog/typedefs/participantTypes';

import { fixtures } from 'tods-competition-factory';
const { flagIOC } = fixtures;

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
  applyStatus?: () => void;
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
  applyStatus,
  closeStatusDialog,
  changeStatusCategory
}) => {
  const classesCommon = useStylesCommon();
  const classes = useStylesMatchParticipant();
  const theme = useTheme();
  const mediaBreakpoints = useMediaQuery(theme.breakpoints.up('sm'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (closeStatusDialog) {
      closeStatusDialog();
    }
    setOpen(false);
  };

  const handleApply = () => {
    applyStatus();
    setOpen(false);
  };

  const participantFlag = (person) => {
    const flag = person.nationalityCode ? flagIOC(person.nationalityCode) : '';
    return flag ? `${flag.trim()} ` : '';
  };

  return (
    <Grid container justify="space-between" className={classes.matchParticipantWrapper}>
      <Grid item>
        {participants.map((participant) => (
          <Typography
            key={participant.id}
            className={`${
              participants.length === 1 ? classes.participantTypographySingle : classes.participantTypographyDouble
            } ${mediaBreakpoints ? classes.participantTypographyFont : classes.participantTypographyFontXS}`}
          >
            {participantFlag(participant)}
            <span className={classes.participantLastName}>{participant.lastName}</span>,{participant.firstName}
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
              mediaBreakpoints
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
