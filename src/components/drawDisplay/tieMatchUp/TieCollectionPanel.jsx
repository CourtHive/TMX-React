import React from 'react';

import Container from '@material-ui/core/Container';
import { useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import StandardPaper from 'components/papers/standard/StandardPaper';
import { useStyles } from 'components/drawDisplay/tieMatchUp/styles';
import TieCollectionItem from 'components/drawDisplay/tieMatchUp/TieCollectionItem';

const TieCollectionPanel = ({
  collectionDefinition,
  enterScore,
  filterOptions,
  onChange,
  side1AvailableParticipants,
  side2AvailableParticipants,
  tieMatchUps
}) => {
  const classes = useStyles();
  const mediaBreakpoints = useMediaQuery('(min-width:800px)');
  const collectionMatchUps = (tieMatchUps || []).filter(
    (matchUp) => matchUp.collectionId === collectionDefinition.collectionId
  );
  const collectionDefinitionValuePoint = collectionDefinition.matchUpValue;

  return (
    <StandardPaper className={classes.paper}>
      <Container className={classes.tieMatchUpContainer} maxWidth={mediaBreakpoints ? 'lg' : 'xl'}>
        <Grid container direction="column" justify="center">
          <Grid item>
            <Typography className={classes.collectionNameTypography}>{collectionDefinition.collectionName}</Typography>
          </Grid>
          {collectionMatchUps.map((collectionMatchUp) => (
            <TieCollectionItem
              key={collectionMatchUp.matchUpId}
              collectionMatchUp={collectionMatchUp}
              enterScore={enterScore}
              filterOptions={filterOptions}
              onChange={onChange}
              pointsValue={
                collectionDefinitionValuePoint ||
                collectionDefinition.collectionValueProfile.find(
                  (profile) => profile.collectionPosition === collectionMatchUp.collectionPosition
                )?.matchUpValue
              }
              side1AvailableParticipants={side1AvailableParticipants}
              side2AvailableParticipants={side2AvailableParticipants}
            />
          ))}
        </Grid>
      </Container>
    </StandardPaper>
  );
};

export default TieCollectionPanel;
