import React from 'react';
import { useStyles } from 'components/drawDisplay/tieMatchUp/styles';
import { useTranslation } from 'react-i18next';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CheckIcon from '@material-ui/icons/Check';
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
  const { t } = useTranslation();
  const isDouble = collectionMatchUp.matchUpType === DOUBLES;

  const handleEnterScore = () => {
    if (enterScore) {
      enterScore(collectionMatchUp);
    }
  };
  const handleGetOptionLabel = (option: ParticipantInterface) => {
    return option?.name || '';
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

  return (
    <>
      <Grid container direction="row" className={classes.collectionItemWrapper} justify="space-between">
        <Grid className={classes.collectionItemGridWrapper} item xs={5}>
          <Grid container direction="row">
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
            {pointsValue && collectionMatchUp.winningSide === 1 ? (
              <Grid item className={classes.matchUpPointsDisplay}>
                <Grid container direction="row">
                  <CheckIcon className={`${classes.tickIcon} ${classes.rightMarginIconText}`} />
                  <Typography className={classes.matchUpPointsDisplayTypography}>{pointsValue}</Typography>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemGridWrapper} item xs={2}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
              <Typography className={classes.positionTypography}>
                {`${t('Position')} #${collectionMatchUp.collectionPosition}`}
                {pointsValue ? ` (${pointsValue}pts)` : ''}
              </Typography>
            </Grid>
            <Grid item onClick={handleEnterScore}>
              <Typography className={!collectionMatchUp?.score ? classes.participantEditTypography : undefined}>
                {collectionMatchUp?.score ? collectionMatchUp.score : 'Match score'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.collectionItemGridWrapper} item xs={5}>
          <Grid container direction="row" justify="flex-end">
            {pointsValue && collectionMatchUp.winningSide === 2 ? (
              <Grid item className={classes.matchUpPointsDisplay}>
                <Grid container direction="row">
                  <Typography className={`${classes.matchUpPointsDisplayTypography} ${classes.rightMarginIconText}`}>
                    {pointsValue}
                  </Typography>
                  <CheckIcon className={classes.tickIcon} />
                </Grid>
              </Grid>
            ) : null}
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
          </Grid>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </>
  );
};

export default TieCollectionItem;
