import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
// import Slide from '@material-ui/core/Slide';
// import { TransitionProps } from '@material-ui/core/transitions';

import { matchUpFormatCode } from 'tods-matchup-format-code';
import ScoringDialogTitle from 'components/dialogs/scoringDialog/ScoringDialogTitle';
import MatchParticipant from 'components/dialogs/scoringDialog/MatchParticipant';
import ScoringDialogContent from 'components/dialogs/scoringDialog/ScoringDialogContent';
import ScoringDialogActions from 'components/dialogs/scoringDialog/ScoringDialogActions';
import CancelButton from 'components/buttons/cancel/CancelButton';
import { useStylesCommon, useStylesScoringDialog } from 'components/dialogs/scoringDialog/styles';
import CustomDialog from 'components/dialogs/CustomDialog';
import {
  MatchConfigurationInterface,
  ScoringMatchUpInterface,
  MatchParticipantStatusCategory,
  StatusIconProps
} from 'components/dialogs/scoringDialog/typedefs/scoringTypes';
import MatchFormatForm from 'components/forms/matchUpFormat/MatchUpFormatForm';

/*
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
*/

interface ScoringDialogProps {
  id: string;
  isOpen: boolean;
  matchConfigParsed: MatchConfigurationInterface;
  matchUp: ScoringMatchUpInterface;
  statusCategories: MatchParticipantStatusCategory[];
  StatusDisplayFactory: React.FC<StatusIconProps>;
  setMatchUp: (matchUp: ScoringMatchUpInterface) => void;
  closeDialog: () => void;
  clearScore: () => void;
  scoreFormatChange: (matchConfigParsed: MatchConfigurationInterface) => void;
  save: () => void;
  applyStatus?: () => void;
  closeStatusDialog?: () => void;
  changeStatusCategory?: (event: React.ChangeEvent<{ name?: string; value: unknown }>, isSide1: boolean) => void;
}

const ScoringDialog: React.FC<ScoringDialogProps> = ({
  id,
  isOpen,
  matchConfigParsed,
  matchUp,
  statusCategories,
  StatusDisplayFactory,
  scoreFormatChange,
  setMatchUp,
  closeDialog,
  clearScore,
  save,
  applyStatus,
  closeStatusDialog,
  changeStatusCategory
}) => {
  const classesCommon = useStylesCommon();
  const classes = useStylesScoringDialog();
  const { t } = useTranslation();
  const theme = useTheme();

  const mediaBreakpoints = useMediaQuery(theme.breakpoints.up('sm'));
  const [shiftPressed, setShiftPressed] = useState(false);
  const [keyCodePressed, setKeyCodePressed] = useState(0);
  const [openEditScoreFormat, setOpenEditScoreFormat] = useState(false);
  const hasMatchEnded = matchUp.status.side1.tdmCode !== 'None' || matchUp.status.side2.tdmCode !== 'None';
  const saveButtonRef = useRef(null);
  const gamePointsInputExists =
    matchUp.status.side1.categoryName === 'Retirements' ||
    matchUp.status.side2.categoryName === 'Retirements' ||
    matchUp.status.side1.categoryName === 'Defaults' ||
    matchUp.status.side2.categoryName === 'Defaults';

  const handleShiftPressed = useCallback((event) => {
    // check if shift is pressed
    if (event.keyCode === 16) {
      setShiftPressed(event.type === 'keydown');
      setKeyCodePressed(0);
    } else {
      setKeyCodePressed(event.keyCode);
    }
  }, []);

  // ref needs to be instantiated in useEffect because otherwise it happens during the state update
  // which causes an exception
  useEffect(() => {
    if (hasMatchEnded && saveButtonRef.current) {
      saveButtonRef.current.focus();
    }
  }, [hasMatchEnded]);
  useEffect(() => {
    document.addEventListener('keydown', handleShiftPressed, false);
    document.addEventListener('keyup', handleShiftPressed, false);

    return () => {
      document.removeEventListener('keydown', handleShiftPressed, false);
      document.removeEventListener('keyup', handleShiftPressed, false);
    };
  }, [handleShiftPressed]);

  const handleOpenEditFormatDialog = () => {
    setOpenEditScoreFormat(true);
  };

  const handleCloseEditFormatDialog = () => {
    setOpenEditScoreFormat(false);
  };

  const scoringDialogTitle = (
    <ScoringDialogTitle id="scoring-dialog-title" onClose={closeDialog}>
      <div className={classes.subheaderContainer}>
        <Typography className={classes.title} variant="h6">
          {t('Enter score')}
        </Typography>
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.subheaderTitle} variant="h6">
              {matchUp.roundName || ''}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justify="flex-end">
              {matchUp.sets.map((set, index) => (
                <React.Fragment
                  key={
                    gamePointsInputExists && index === matchUp.sets.length
                      ? `${set.setNumber}-game-points`
                      : set.setNumber
                  }
                >
                  <Grid className={mediaBreakpoints ? classesCommon.setEntry : classesCommon.setEntryXS} item>
                    <Typography className={classes.subheaderSets} variant="h6">
                      {mediaBreakpoints ? `${t('SET')} ${set.setNumber}` : `S${set.setNumber}`}
                    </Typography>
                  </Grid>
                  {!!set.tiebreak && set.isActive && (
                    <Grid className={mediaBreakpoints ? classesCommon.setEntry : classesCommon.setEntryXS} item>
                      <Typography className={classes.subheaderSets} variant="h6">
                        {mediaBreakpoints ? 'TBRK' : 'TB'}
                      </Typography>
                    </Grid>
                  )}
                  {set.gameResult && !matchConfigParsed.timed && (
                    <Grid className={mediaBreakpoints ? classesCommon.setEntry : classesCommon.setEntryXS} item>
                      <Typography className={classes.subheaderSets} variant="h6">
                        {t('GAME')}
                      </Typography>
                    </Grid>
                  )}
                </React.Fragment>
              ))}
              {/* empty spot */}
              <Grid className={mediaBreakpoints ? classesCommon.setEntry : classesCommon.setEntryXS} item />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ScoringDialogTitle>
  );

  const scoringDialogActions = (
    <ScoringDialogActions>
      <Grid container direction="column" className={classes.actionWrapper}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.matchFormatTypography}>
              {matchUpFormatCode.stringify(matchConfigParsed)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography id="sd-clear-score" onClick={clearScore} className={classes.actionAreaTypography}>
              Clear score
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <Typography
              id="sd-edit-score-format"
              className={classes.actionAreaTypography}
              onClick={handleOpenEditFormatDialog}
            >
              {t('Edit score format')}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row-reverse" spacing={2}>
          <Grid item xs={12} sm="auto">
            {/* TODO: create button wrappers with their own styles */}
            <Button
              id="sd-save-button"
              ref={saveButtonRef}
              color="primary"
              variant="contained"
              className={classes.actionButton}
              onClick={save}
            >
              {t('Save & close')}
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <CancelButton
              id="sd-cancel-button"
              onClick={closeDialog}
              className={classes.actionButton}
              variant={mediaBreakpoints ? 'text' : 'outlined'}
            >
              {t('Cancel')}
            </CancelButton>
          </Grid>
        </Grid>
      </Grid>
    </ScoringDialogActions>
  );

  const scoringDialogContent = (
    <ScoringDialogContent>
      <div className={classes.matchParticipantsWrapper}>
        <MatchParticipant
          isSide1={true}
          shiftPressed={shiftPressed}
          gamePointsInputExists={gamePointsInputExists}
          keyCodePressed={keyCodePressed}
          participants={matchUp.participantSide1}
          matchUp={matchUp}
          matchConfigParsed={matchConfigParsed}
          statusCategories={statusCategories}
          StatusDisplayFactory={StatusDisplayFactory}
          setMatchUp={setMatchUp}
          applyStatus={applyStatus}
          closeStatusDialog={closeStatusDialog}
          changeStatusCategory={changeStatusCategory}
        />
        <MatchParticipant
          isSide1={false}
          shiftPressed={shiftPressed}
          gamePointsInputExists={gamePointsInputExists}
          keyCodePressed={keyCodePressed}
          participants={matchUp.participantSide2}
          matchUp={matchUp}
          matchConfigParsed={matchConfigParsed}
          statusCategories={statusCategories}
          StatusDisplayFactory={StatusDisplayFactory}
          setMatchUp={setMatchUp}
          applyStatus={applyStatus}
          closeStatusDialog={closeStatusDialog}
          changeStatusCategory={changeStatusCategory}
        />
      </div>
    </ScoringDialogContent>
  );

  const editFormatDialogTitle = (
    <ScoringDialogTitle id="scoring-dialog-title" onClose={closeDialog}>
      {t('Edit Score Format')}
    </ScoringDialogTitle>
  );

  const editFormatDialogContent = (
    <ScoringDialogContent>
      <div className={classes.editFormatDialogContentWrapper}>
        <MatchFormatForm matchFormatParsed={matchConfigParsed} onChange={scoreFormatChange} />
      </div>
    </ScoringDialogContent>
  );

  const editFormatDialogActions = (
    <ScoringDialogActions>
      <Grid container direction="row-reverse" spacing={2} className={classes.editFormatDialogActionsWrapper}>
        <Grid item xs={12} sm="auto">
          <CancelButton
            id="close-edit-format-dialog"
            onClick={handleCloseEditFormatDialog}
            variant={mediaBreakpoints ? 'text' : 'outlined'}
          >
            {t('Close')}
          </CancelButton>
        </Grid>
      </Grid>
    </ScoringDialogActions>
  );

  if (!matchUp.participantSide1 || !matchUp.participantSide2) return null;

  return (
    <div>
      <CustomDialog id={id} open={isOpen} handleOnClose={closeDialog} fullScreen={!mediaBreakpoints}>
        <div className={mediaBreakpoints ? classes.root : classes.rootXS}>
          {scoringDialogTitle}
          {scoringDialogContent}
          {scoringDialogActions}
        </div>
      </CustomDialog>
      <CustomDialog
        id="edit-format-dialog"
        open={openEditScoreFormat}
        handleOnClose={handleCloseEditFormatDialog}
        fullScreen={!mediaBreakpoints}
      >
        <div className={mediaBreakpoints ? classes.root : classes.rootXS}>
          {editFormatDialogTitle}
          {editFormatDialogContent}
          {editFormatDialogActions}
        </div>
      </CustomDialog>
    </div>
  );
};
// TransitionComponent={Transition}

export default ScoringDialog;
