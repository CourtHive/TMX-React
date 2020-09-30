import React from 'react';
import { useStyles } from './style.js';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TAB_EVENTS, TAB_MATCHUPS, TAB_SCHEDULE } from 'stores/tmx/types/tabs';

import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import DrawTieMatchUps from 'components/drawDisplay/tieMatchUp/TieMatchUp';
import { tournamentEngine } from 'tods-competition-factory';

export const TieMatchUpContainer = (props) => {
  const { tieMatchUp } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  const tab = useSelector((state: any) => state.tmx.visible.tabPanel);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const { matchUp } = tournamentEngine.setState(tournamentRecord).devContext(true).findMatchUp(tieMatchUp);

  const clearMatchUp = () => {
    dispatch({ type: 'scoring tieMatchUp' });
  };

  const handleImportLineup = () => {
    console.log('import lineup');
  };

  const handleEditParticipant = ({ tieMatchUp, sideNumber, participantId, sideMember }) => {
    const { drawId, matchUpId: tieMatchUpId, Sides } = tieMatchUp;
    const side = Sides[sideNumber - 1];
    const individualParticipants = side?.participant?.individualParticipants?.map((participant) => ({
      participantId: participant?.participantId
    }));
    dispatch({
      type: 'tournamentEngine',
      payload: {
        methods: [
          {
            method: 'assignTieMatchUpParticipantId',
            params: { drawId, participantId, sideNumber, sideMember, tieMatchUpId, individualParticipants }
          }
        ]
      }
    });
  };
  const handleEnterScore = (matchUp) => {
    dispatch({ type: 'scoring details', payload: { matchUp } });
  };

  const navigateBackMessage =
    tab === TAB_MATCHUPS
      ? t('Back to Matches')
      : tab === TAB_EVENTS
      ? t('Back to Draw')
      : tab === TAB_SCHEDULE
      ? t('Back to Schedule')
      : t('Back');

  return (
    <>
      {!matchUp ? null : (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="primary" className={classes.breadcrumb}>
              <ArrowBackIcon className={classes.icon} />
              <Link color="inherit" onClick={clearMatchUp}>
                {navigateBackMessage}
              </Link>
            </Typography>
          </Breadcrumbs>
          <Typography className={classes.drawMatchTitle} variant="h4">
            {t('Match Scorecard')}
          </Typography>
          <DrawTieMatchUps
            editParticipant={handleEditParticipant}
            enterScore={handleEnterScore}
            importLineup={handleImportLineup}
            matchUp={matchUp}
          />
        </>
      )}
    </>
  );
};
