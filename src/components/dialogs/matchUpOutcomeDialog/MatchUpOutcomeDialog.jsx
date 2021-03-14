import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../CustomDialog';

import { useStylesMatchUpOutcomeDialog } from './styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';

import MatchUpSide from './MatchUpSide';
import TMXStandardButton from 'components/buttons/standard/TMXStandardButton';
import KeyScoreEntry from 'components/inputs/keyScoreEntry/KeyScoreEntry';
import { drawEngine } from 'tods-competition-factory';

export const MatchOutcomeDialog = (props) => {
  const { matchUp, isOpen, closeDialog, setOutcome, acceptOutcome } = props;
  const classes = useStylesMatchUpOutcomeDialog();

  const matchUpData = {
    updated: undefined,
    score: undefined,
    sets: undefined,
    winningSide: undefined,
    matchUpId: undefined,
    matchUpStatus: undefined
  };
  const [data, setData] = useState(matchUpData);
  const [shifted, setShiftState] = useState(false);

  const { t } = useTranslation();

  const handleClearOutcome = () => {
    const matchUpData = {
      updated: undefined,
      score: undefined,
      sets: undefined,
      winningSide: undefined,
      matchUpId: undefined,
      matchUpStatus: undefined
    };
    setData(matchUpData);
    handleSetOutcome(matchUpData);
  };

  const handleMathcUpFormatSelect = () => {
    console.log('matchUpFormat selector');
  };

  const handleSetOutcome = (updatedData) => {
    const sets = updatedData.sets || [];
    const score = {
      sets,
      scoreStringSide1: drawEngine.generateScoreString({ sets }),
      scoreStringSide2: drawEngine.generateScoreString({ sets, reversed: true })
    };
    const outcome = {
      score,
      matchUpStatus: updatedData.matchUpStatus,
      winningSide: updatedData.winningSide || undefined,
      matchUpFormat
    };
    setOutcome({ outcome });
  };

  const matchUpFormat = matchUp?.matchUpFormat;

  const updateData = (updatedData) => {
    setData(updatedData);
    handleSetOutcome(updatedData);
  };

  useHotkeys(
    '*',
    (event) => {
      event.preventDefault();
      if (event.type === 'keydown' && event.key === 'Shift') setShiftState(true);
      if (event.type === 'keyup' && event.key === 'Shift') setShiftState(false);
    },
    { keydown: true, keyup: true },
    [matchUp]
  );

  const outcomeDialogTitle = (
    <MuiDialogTitle className={classes.outcomeTitle} id="outcome-dialog-title">
      <div className={classes.subheaderContainer}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.roundNameTypography} variant="h6">
              {matchUp?.roundName || ''}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.roundNameTypography} variant="h6">
              {shifted && 'Shifted'}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justify="flex-end">
              <Grid item>
                <Typography
                  id="matchUpFormat-select"
                  className={classes.matchUpFormatTypography}
                  onClick={handleMathcUpFormatSelect}
                >
                  {matchUpFormat}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiDialogTitle>
  );

  const outcomeDialogContent = (
    <MuiDialogContent>
      <div className={classes.matchParticipantsWrapper}>
        <MatchUpSide sideNumber={1} matchUp={matchUp} setOutcome={handleSetOutcome} />
        <MatchUpSide sideNumber={2} matchUp={matchUp} setOutcome={handleSetOutcome} />
      </div>
    </MuiDialogContent>
  );

  const outcomeDialogActions = (
    <MuiDialogActions style={{ margin: 0, padding: 0 }}>
      <Grid container direction="column" className={classes.actionWrapper}>
        <Grid container direction="row-reverse" spacing={2}>
          <Grid item xs={12} sm="auto">
            <TMXStandardButton onClick={acceptOutcome}>{t('Accept')}</TMXStandardButton>
          </Grid>
          <Grid item xs={12} sm="auto">
            <TMXStandardButton onClick={handleClearOutcome}>{t('Clear')}</TMXStandardButton>
          </Grid>
          <Grid item xs={12} sm="auto">
            <TMXStandardButton onClick={closeDialog}>{t('Cancel')}</TMXStandardButton>
          </Grid>
        </Grid>
      </Grid>
    </MuiDialogActions>
  );

  const onEnter = () => {
    const scoreString = matchUp?.score?.scoreStringSide1;
    const matchUpData = {
      updated: undefined,
      score: scoreString,
      sets: (scoreString && matchUp?.score?.sets) || [],
      winningSide: matchUp?.winningSide,
      matchUpId: matchUp?.matchUpId,
      matchUpStatus: matchUp?.matchUpStatus
    };
    setData(matchUpData);
  };

  return (
    <>
      <CustomDialog id="match-outcome" onEnter={onEnter} open={isOpen} handleOnClose={closeDialog}>
        <div className={classes.root}>
          {outcomeDialogTitle}
          <KeyScoreEntry
            currentMatchUpId={data.matchUpId}
            matchUpFormat={matchUpFormat}
            updateData={updateData}
            data={data}
          />
          {outcomeDialogContent}
          {outcomeDialogActions}
        </div>
      </CustomDialog>
    </>
  );
};
