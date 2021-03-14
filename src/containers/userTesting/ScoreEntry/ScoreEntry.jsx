import React, { useState } from 'react';
import { useStyles } from './style';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import ScoringDialogTitle from 'components/dialogs/scoringDialog/ScoringDialogTitle';
import ScoringDialogActions from 'components/dialogs/scoringDialog/ScoringDialogActions';
import CancelButton from 'components/buttons/cancel/CancelButton';
import CustomDialog from 'components/dialogs/CustomDialog';
import MatchUpFormatForm from 'components/forms/matchUpFormat/MatchUpFormatForm';
import KeyScoreEntry from 'components/inputs/keyScoreEntry/KeyScoreEntry';
import { matchUpFormatCode } from 'tods-matchup-format-code';

export function ScoreEntry() {
  const classes = useStyles();

  const initialValues = [
    {
      updated: undefined,
      score: undefined,
      sets: [],
      winningSide: undefined,
      matchUpId: 'm001',
      matchUpStatus: undefined
    },
    {
      updated: undefined,
      score: undefined,
      sets: [],
      winningSide: undefined,
      matchUpId: 'm002',
      matchUpStatus: undefined
    },
    {
      updated: undefined,
      score: undefined,
      sets: [],
      winningSide: undefined,
      matchUpId: 'm003',
      matchUpStatus: undefined
    }
  ];

  const defaultMatchUpFormat = 'SET3-S:6/TB7';
  const [open, setOpen] = useState(false);
  const [matchUpFormat, setMatchUpFormat] = useState(defaultMatchUpFormat);
  const [values, setValues] = useState(initialValues);
  const [currentMatchUpId, setCurrentMatchUpId] = useState(initialValues[0].matchUpId);

  const closeDialog = () => setOpen(false);

  const resetValues = () => {
    setValues(initialValues);
  };

  const updateData = (data) => {
    const newData = values.map((value) => {
      return value.matchUpId === data.matchUpId ? data : value;
    });
    setValues(newData);
  };

  const scoreFormatChange = (format) => {
    if (format.timed && format.bestOf > 1) {
      format = {
        bestOf: format.bestOf,
        setFormat: {
          timed: true,
          minutes: format.minutes
        }
      };
    }
    setMatchUpFormat(matchUpFormatCode.stringify(format));
    setValues(initialValues);
  };

  const WinIndicator = () => <CheckCircleIcon style={{ color: green[500] }} />;

  const editFormatDialogTitle = (
    <ScoringDialogTitle id="scoring-dialog-title" onClose={closeDialog}>
      Edit Score Format
    </ScoringDialogTitle>
  );

  const editFormatDialogContent = (
    <>
      <div className={classes.editFormatDialogContentWrapper}>
        <MatchUpFormatForm
          matchUpFormatParsed={matchUpFormatCode.parse(matchUpFormat || defaultMatchUpFormat)}
          onChange={scoreFormatChange}
        />
      </div>
    </>
  );

  const editFormatDialogActions = (
    <ScoringDialogActions>
      <Grid container direction="row-reverse" spacing={2} className={classes.editFormatDialogActionsWrapper}>
        <Grid item xs={12} sm="auto">
          <CancelButton id="close-edit-format-dialog" onClick={closeDialog} variant={'outlined'}>
            Close
          </CancelButton>
        </Grid>
      </Grid>
    </ScoringDialogActions>
  );

  const editMatchUpFormat = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleRowChange = (increment = 0, matchUpId) => {
    if (matchUpId) {
      let nextRowIndex = values.map((matchUp) => matchUp.matchUpId).indexOf(matchUpId) + increment;
      if (nextRowIndex >= 0) {
        if (nextRowIndex > 2) {
          nextRowIndex = 0;
        }
        const nextMatchUpId = values[nextRowIndex].matchUpId;
        setCurrentMatchUpId(nextMatchUpId);
      } else {
        const nextMatchUpId = values[values.length - 1].matchUpId;
        setCurrentMatchUpId(nextMatchUpId);
      }
    }
  };

  return (
    <>
      <Box p={3} m={3} textAlign="center" bgcolor="background.paper">
        <Typography variant="h3" component="h2" gutterBottom style={{ fontSize: 40, fontWeight: 600 }}>
          Hot Key Score Entry
        </Typography>
        <Grid container direction="row" justify="space-around" className={classes.root}>
          <Grid item xs={12} sm="auto">
            MatchUp 1
            <Grid container direction="row">
              <div style={{ paddingTop: '.5em' }}>{values[0].winningSide === 1 ? <WinIndicator /> : null}</div>
              <KeyScoreEntry
                currentMatchUpId={currentMatchUpId}
                matchUpFormat={matchUpFormat}
                rowChange={handleRowChange}
                data={values[0]}
                updateData={updateData}
              />
              <div style={{ paddingTop: '.5em' }}>{values[0].winningSide === 2 ? <WinIndicator /> : null}</div>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-around" className={classes.root} style={{ marginTop: '1em' }}>
          <Grid item xs={12} sm="auto">
            MatchUp 2
            <Grid container direction="row">
              <div style={{ paddingTop: '.5em' }}>{values[1].winningSide === 1 ? <WinIndicator /> : null}</div>
              <KeyScoreEntry
                currentMatchUpId={currentMatchUpId}
                matchUpFormat={matchUpFormat}
                rowChange={handleRowChange}
                data={values[1]}
                updateData={updateData}
              />
              <div style={{ paddingTop: '.5em' }}>{values[1].winningSide === 2 ? <WinIndicator /> : null}</div>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-around" className={classes.root} style={{ marginTop: '1em' }}>
          <Grid item xs={12} sm="auto">
            MatchUp 3
            <Grid container direction="row">
              <div style={{ paddingTop: '.5em' }}>{values[2].winningSide === 1 ? <WinIndicator /> : null}</div>
              <KeyScoreEntry
                currentMatchUpId={currentMatchUpId}
                matchUpFormat={matchUpFormat}
                rowChange={handleRowChange}
                data={values[2]}
                updateData={updateData}
              />
              <div style={{ paddingTop: '.5em' }}>{values[2].winningSide === 2 ? <WinIndicator /> : null}</div>
            </Grid>
          </Grid>
        </Grid>
        <Button className={classes.button} variant="outlined" onClick={editMatchUpFormat}>
          {matchUpFormat}
        </Button>
        <Button className={classes.button} variant="outlined" onClick={resetValues}>
          Reset
        </Button>
      </Box>
      <CustomDialog id="edit-format-dialog" open={open} fullScreen={false} handleOnClose={handleCloseDialog}>
        <div className={classes.rootXS}>
          {editFormatDialogTitle}
          {editFormatDialogContent}
          {editFormatDialogActions}
        </div>
      </CustomDialog>
    </>
  );
}
