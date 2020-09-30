import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';

import { useStyles } from './style';
import { env } from '../../config/defaults';
import { context } from 'services/context';
import { useTranslation } from "react-i18next";
import {
   TAB_TOURNAMENT, TAB_PLAYERS, TAB_EVENTS, TAB_SCHEDULE
} from '../../stores/tmx/types/tabs';

export const PublishButton = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const pubAction = useSelector(state => state.tmx.pubAction);
  const tab = useSelector(state => state.tmx.visible.tabPanel);

  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournament = useSelector((state) => state.tmx.records[selectedTournamentId]);

  const selectedDraw = useSelector(state => state.tmx.select.draws.draw);
  const { publishState, tabContext } = contextPublishState({tournament, selectedDraw, tab});
  const variant = publishState ? 'contained' : 'outlined';
  const color = publishState === true ? 'secondary' : 'primary';
  const buttonLabel = t(publishState ? 'draws.published' : 'draws.publish');
  const publishAction = () => { context.ee.emit('contextPublish', {tabContext, pubAction}); }
  const Publish = () => (
    <Button className={classes.button} color={color} variant={variant} onClick={publishAction} >
      {buttonLabel}
    </Button>
  );
  return ( <> { env.visibleButtons.publish ? <Publish /> : ''} </>);
};

export default PublishButton;

function contextPublishState({tournament, selectedDraw, tab}) {
  let up_to_date, tabContext, published;
  if (tab === TAB_EVENTS) {
    /*
    tabContext = 'draws';
    let drawDefinition = (tournament.events || []).reduce((p, c) => c.euid === selectedDraw ? c : p, tournament.events[0]);
    published = drawDefinition && drawDefinition.published;
    up_to_date = drawDefinition && drawDefinition.up_to_date;
    */
  } else if (tab === TAB_PLAYERS) {
    /*
    tabContext = 'players';
    published = tournament && tournament.publishing && tournament.publishing.players && true;
    up_to_date = tournament && tournament.publishing && tournament.publishing.players && tournament.publishing.players.up_to_date;
    */
  } else if (tab === TAB_SCHEDULE) {
    /*
    tabContext = 'schedule';
    published = tournament && tournament.schedule && tournament.schedule.published;
    up_to_date = tournament && tournament.schedule && tournament.schedule.up_to_date;
    */
  } else if (tab === TAB_TOURNAMENT) {
    /*
    tabContext = 'tournament';
    published = tournament && tournament.infoPublished !== undefined;
    up_to_date = tournament.infoPublished !== false;
    */
  }
  let publishState = (published && up_to_date) || published;
  return { publishState, tabContext };
}