import React from 'react';
import { useStyles } from 'components/drawDisplay/tieMatchUp/styles';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';

import { MatchUpInterface } from 'typedefs/store/scheduleTypes';
import TMXAutocomplete from 'components/autocomplete/TMXAutocomplete';
import { ParticipantInterface } from 'typedefs/store/tmxTypes';

import { matchUpTypes } from 'tods-competition-factory';
const { DOUBLES } = matchUpTypes;

interface TieCollectionItemProps {
  collectionMatchUp: MatchUpInterface;
  enterScore?: (matchUp: MatchUpInterface) => void;
  filterOptions?: (matchUpType: string, options: ParticipantInterface[], side: number) => ParticipantInterface[];
  onChange?: (
    tieMatchUp: MatchUpInterface,
    side: number,
    participantId: string | ParticipantInterface | (string | ParticipantInterface)[],
    sideMember: number
  ) => void;
  pointsValue?: number;
  side1AvailableParticipants: ParticipantInterface[];
  side2AvailableParticipants: ParticipantInterface[];
}

const TieCollectionItem: React.FC<TieCollectionItemProps> = ({
  collectionMatchUp,
  enterScore,
  filterOptions,
  onChange,
  pointsValue,
  side1AvailableParticipants,
  side2AvailableParticipants
}) => {
  const classes = useStyles();
  const isDouble = collectionMatchUp.matchUpType === DOUBLES;

  const handleEnterScore = () => {
    if (enterScore) {
      enterScore(collectionMatchUp);
    }
  };
  const handleGetOptionLabel = (option: ParticipantInterface) => {
    return option?.participantName || '';
  };

  const handleSide1Member1Change = (
    event: React.ChangeEvent<{}>,
    value: string | ParticipantInterface | (string | ParticipantInterface)[]
  ) => {
    if (onChange) {
      onChange(collectionMatchUp, 1, value, 1);
    }
  };
  const handleSide1Member2Change = (
    event: React.ChangeEvent<{}>,
    value: string | ParticipantInterface | (string | ParticipantInterface)[]
  ) => {
    if (onChange) {
      onChange(collectionMatchUp, 1, value, 2);
    }
  };
  const handleSide2Member1Change = (
    event: React.ChangeEvent<{}>,
    value: string | ParticipantInterface | (string | ParticipantInterface)[]
  ) => {
    if (onChange) {
      onChange(collectionMatchUp, 2, value, 1);
    }
  };
  const handleSide2Member2Change = (
    event: React.ChangeEvent<{}>,
    value: string | ParticipantInterface | (string | ParticipantInterface)[]
  ) => {
    if (onChange) {
      onChange(collectionMatchUp, 2, value, 2);
    }
  };
  const handleGetOptionSelected = (option, value) =>
    !option || value === '' || option.participantId === value.participantId;
  const handleFilterOptionsSide1 = (options: ParticipantInterface[]) =>
    filterOptions(collectionMatchUp.matchUpType, options, 1);
  const handleFilterOptionsSide2 = (options: ParticipantInterface[]) =>
    filterOptions(collectionMatchUp.matchUpType, options, 2);

  const side1Participant = collectionMatchUp.sides[0]?.participant;
  const side2Participant = collectionMatchUp.sides[1]?.participant;
  const side1IndividualParticipants = collectionMatchUp.sides[0]?.participant?.individualParticipants || [];
  const side2IndividualParticipants = collectionMatchUp.sides[1]?.participant?.individualParticipants || [];
  const side1Member1Participant = isDouble ? side1IndividualParticipants[0] : side1Participant;
  const side1Member2Participant = side1IndividualParticipants[1];
  const side2Member1Participant = isDouble ? side2IndividualParticipants[0] : side2Participant;
  const side2Member2Participant = side2IndividualParticipants[1];
  const disableClearable = Boolean(collectionMatchUp.winningSide);

  const scoreString = collectionMatchUp.score?.scoreStringSide1;
  const collectionPosition = collectionMatchUp.collectionPosition;

  const leftSide =
    collectionMatchUp.winningSide === 1
      ? { border: 2, borderColor: 'forestgreen' }
      : { border: 2, borderColor: 'lightgray' };
  const rightSide =
    collectionMatchUp.winningSide === 2
      ? { border: 2, borderColor: 'forestgreen' }
      : { border: 2, borderColor: 'lightgray' };

  return (
    <>
      <Grid container direction="row" className={classes.collectionItemWrapper}>
        <Grid className={classes.collectionPositionColumn} item>
          <Grid container direction="row" justify="center">
            <Grid item className={isDouble ? classes.matchUpDoublesPointsDisplay : classes.matchUpPointsDisplay}>
              <Grid container direction="row" wrap="nowrap">
                <Typography className={classes.collectionPositionTypography}>{collectionPosition}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemGridWrapper} item>
          <Grid container direction="row">
            <Box {...leftSide}>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.participantWrapper}
                >
                  <Grid item className={classes.participantEdit}>
                    <TMXAutocomplete
                      autoComplete={true}
                      autoHighlight={true}
                      filterOptions={handleFilterOptionsSide1}
                      fullWidth
                      disableClearable={disableClearable}
                      getOptionLabel={handleGetOptionLabel}
                      getOptionSelected={handleGetOptionSelected}
                      onChange={handleSide1Member1Change}
                      options={side1AvailableParticipants}
                      value={side1Member1Participant}
                    />
                  </Grid>
                  {isDouble && (
                    <Grid item className={`${classes.participantEdit} ${classes.participantEditDoubleBottom}`}>
                      <TMXAutocomplete
                        autoComplete={true}
                        autoHighlight={true}
                        filterOptions={handleFilterOptionsSide1}
                        fullWidth
                        disableClearable={disableClearable}
                        getOptionLabel={handleGetOptionLabel}
                        getOptionSelected={handleGetOptionSelected}
                        onChange={handleSide1Member2Change}
                        options={side1AvailableParticipants}
                        value={side1Member2Participant}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemPointsColumn} item>
          <Grid container direction="row" justify="center">
            {pointsValue ? (
              <Grid item className={isDouble ? classes.matchUpDoublesPointsDisplay : classes.matchUpPointsDisplay}>
                <Grid container direction="row" wrap="nowrap">
                  <Typography className={classes.matchUpPointsDisplayTypography}>{pointsValue}</Typography>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemGridWrapper} item>
          <Grid container direction="row" justify="flex-end">
            <Box {...rightSide}>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.participantWrapper}
                >
                  <Grid item className={classes.participantEdit}>
                    <TMXAutocomplete
                      autoComplete={true}
                      autoHighlight={true}
                      filterOptions={handleFilterOptionsSide2}
                      fullWidth
                      disableClearable={disableClearable}
                      getOptionLabel={handleGetOptionLabel}
                      getOptionSelected={handleGetOptionSelected}
                      onChange={handleSide2Member1Change}
                      options={side2AvailableParticipants}
                      value={side2Member1Participant}
                    />
                  </Grid>
                  {isDouble && (
                    <Grid item className={`${classes.participantEdit} ${classes.participantEditDoubleBottom}`}>
                      <TMXAutocomplete
                        autoComplete={true}
                        autoHighlight={true}
                        filterOptions={handleFilterOptionsSide2}
                        fullWidth
                        disableClearable={disableClearable}
                        getOptionLabel={handleGetOptionLabel}
                        getOptionSelected={handleGetOptionSelected}
                        onChange={handleSide2Member2Change}
                        options={side2AvailableParticipants}
                        value={side2Member2Participant}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemGridWrapper} item>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item className={classes.collectionScoreColumn} onClick={handleEnterScore}>
              <Typography className={scoreString ? classes.scoreStringTypography : undefined}>
                {scoreString ? scoreString : 'Match score'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default TieCollectionItem;
