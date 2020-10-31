import React from 'react';
import { useStyles } from './styles';
import { useMediaQuery } from '@material-ui/core';

import { drawEngine } from 'tods-competition-factory';

import TieTeam from './TieTeam';
import TieCollectionPanel from './TieCollectionPanel';
import { Container, Grid, Typography } from '@material-ui/core';
import StandardPaper from 'components/papers/standard/StandardPaper';

import { MatchUpInterface } from 'typedefs/store/scheduleTypes';
import { ParticipantInterface } from 'typedefs/store/tmxTypes';

export interface EditParticipantArgs {
  tieMatchUp: MatchUpInterface;
  sideNumber: number;
  participantId: string;
  sideMember: number;
}

interface DrawTieMatchUpsProps {
  editParticipant?: ({ tieMatchUp, sideNumber, participantId, sideMember }: EditParticipantArgs) => void;
  enterScore?: (matchUp: MatchUpInterface) => void;
  drawData?: any;
  importLineup?: () => void;
  matchUp: MatchUpInterface;
}

const DrawTieMatchUps: React.FC<DrawTieMatchUpsProps> = ({
  editParticipant,
  importLineup,
  enterScore,
  drawData,
  matchUp
}) => {
  const classes = useStyles();
  const mediaBreakpoints = useMediaQuery('(min-width:800px)');
  const { tieMatchUps, tieFormat } = matchUp || {};
  const side1AvailableParticipants = matchUp?.sides[0].participant.individualParticipants;
  const side2AvailableParticipants = matchUp?.sides[1].participant.individualParticipants;
  const drawTieFormat = drawData?.drawDefinition?.tieFormat;
  const collectionDefinitions = (tieFormat || drawTieFormat).collectionDefinitions;
  const sideName = (sideNumber) => {
    const side = (matchUp.sides || [])[sideNumber - 1];
    const participant = side?.participant;
    return participant?.name || `Side ${sideNumber}`;
  };

  const sideLogo = (sideNumber) => {
    const side = (matchUp.sides || [])[sideNumber - 1];
    const participant = side?.participant;
    const profiles = participant?.onlineProfiles || [];
    const url = profiles.reduce<string | undefined>((url, candidate) => {
      return candidate.type === 'Logo' ? candidate.identifier : url;
    }, undefined);
    return url || null;
  };
  const handleOnChange = (
    tieMatchUp: MatchUpInterface,
    sideNumber: number,
    participant: string | ParticipantInterface | (string | ParticipantInterface)[],
    sideMember: number
  ) => {
    const participantObject = participant as ParticipantInterface;
    const participantId = participantObject?.participantId;
    editParticipant({ tieMatchUp, sideNumber, participantId, sideMember });
  };
  const handleFilterOptions = (matchUpType: string, options: ParticipantInterface[], side: number) => {
    const alreadySelected = tieMatchUps.flatMap((tieMatchUp) => {
      const matchUpSide = tieMatchUp.sides[side - 1];

      return matchUpType === 'DOUBLES'
        ? matchUpSide?.participant?.individualParticipants?.length > 0 && tieMatchUp.matchUpType === matchUpType
          ? matchUpSide.participant.individualParticipants
              .map((side1Individual) => side1Individual?.participantId)
              .filter((side1Individual) => !!side1Individual)
          : []
        : matchUpSide?.participant?.participantId
        ? matchUpSide.participant.participantId
        : [];
    });
    return options.filter((option) => option && !alreadySelected.includes(option.participantId));
  };

  const side1Name = sideName(1);
  const side2Name = sideName(2);
  const side1Logo = sideLogo(1);
  const side2Logo = sideLogo(2);

  const tieScore = drawEngine.calcTieMatchUpScore({ matchUp }) || '0-0';
  const sideScores = tieScore.split('-');

  /*
          <Grid container direction="column" justify="center">
            <Typography align="center" className={classes.headerPanel}>
              USTA National Campus, Orlando, FL
            </Typography>
            <Typography align="center" className={classes.headerPanel}>
              FRIDAY, MARCH 20, 2019 5:00 PM
            </Typography>
          </Grid>
          */
  return (
    <>
      <StandardPaper className={classes.standardPaperWithBorderTop}>
        <Container className={classes.tieMatchUpContainer} maxWidth={mediaBreakpoints ? 'lg' : 'xl'}>
          <Grid container direction="row" justify="center">
            <Grid item xs={5}>
              {/* TODO: where do names come from? */}
              <TieTeam
                importLineup={importLineup}
                justifyContent="flex-end"
                teamLogo={side1Logo}
                teamName={side1Name}
                sideNumber={1}
              />
            </Grid>
            <Grid className={classes.resultContainer} item xs={2}>
              <Grid alignItems="center" container>
                <Typography align="center" className={classes.resultTypography} variant="body1">
                  {sideScores.join(' : ')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <TieTeam
                importLineup={importLineup}
                justifyContent="flex-start"
                teamLogo={side2Logo}
                teamName={side2Name}
                sideNumber={2}
              />
            </Grid>
          </Grid>
        </Container>
      </StandardPaper>
      {collectionDefinitions.map((collectionDefinition) => (
        <TieCollectionPanel
          key={collectionDefinition.collectionId}
          collectionDefinition={collectionDefinition}
          enterScore={enterScore}
          filterOptions={handleFilterOptions}
          onChange={handleOnChange}
          side1AvailableParticipants={side1AvailableParticipants}
          side2AvailableParticipants={side2AvailableParticipants}
          tieMatchUps={tieMatchUps}
        />
      ))}
    </>
  );
};

export default DrawTieMatchUps;
