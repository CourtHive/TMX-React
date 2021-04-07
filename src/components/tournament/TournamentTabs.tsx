import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { tabRoute } from './tabRoute';
import { Tooltip, Tabs, useMediaQuery } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EventIcon from '@material-ui/icons/EmojiEvents';

import MatchUpsIcon from 'components/icons/MatchUpsIcon';

import { TMXTab } from 'components/tabs/TMXTab';

import {
  TAB_TOURNAMENT,
  TAB_PARTICIPANTS,
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_MATCHUPS
} from 'stores/tmx/types/tabs';
import { useStyles } from 'components/tournament/styles';
import { useHistory } from 'react-router-dom';
import useTheme from '@material-ui/core/styles/useTheme';

export function TournamentTabs({ tournament, tabIndex }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const theme = useTheme();
  const mediaBreakpoints = useMediaQuery(theme.breakpoints.up('xs'));
  const tabState = useSelector((state: any) => state.tmx.visible.tabState);

  const labelMaker = (icon, label) =>
    tabState === 'text' ? (
      t(label)
    ) : (
      <Tooltip title={t(label)} aria-label={t(label)}>
        {icon}
      </Tooltip>
    );

  const infoLabel = labelMaker(<InfoIcon />, 'Information');
  const groupLabel = labelMaker(<GroupIcon />, 'Participants');
  const locationLabel = labelMaker(<LocationOnIcon />, 'Locations');
  const scheduleLabel = labelMaker(<ScheduleIcon />, 'Schedule');
  const matchUpsLabel = labelMaker(<MatchUpsIcon />, 'Matches');
  const eventsLabel = labelMaker(<EventIcon />, 'Events');

  const tabValues = {
    [TAB_TOURNAMENT]: { label: infoLabel, id: 'tab-tournament' },
    [TAB_PARTICIPANTS]: { label: groupLabel, id: 'tab-participants' },
    [TAB_EVENTS]: { label: eventsLabel, id: 'tab-events' },
    [TAB_LOCATIONS]: { label: locationLabel, id: 'tab-locations' },
    [TAB_SCHEDULE]: { label: scheduleLabel, id: 'tab-schedule' },
    [TAB_MATCHUPS]: { label: matchUpsLabel, id: 'tab-matchUps' }
  };

  const visibleTabs = useSelector((state: any) => state.tmx.visible.tabs);

  const handleChange = (_, newValue) => {
    const targetTabIndex = visibleTabs[newValue];
    const { tournamentId } = tournament || {};
    const nextRoute = tabRoute({ tournamentId, tabIndex: targetTabIndex });
    history.push(nextRoute);
  };

  const value = tabIndex >= 0 ? tabIndex : 0;

  const className = mediaBreakpoints ? classes.tab : classes.tabSm;
  return (
    <Tabs
      value={value}
      orientation="vertical"
      aria-label={'tournament tabs'}
      indicatorColor={'primary'}
      onChange={handleChange}
      variant={'scrollable'}
      scrollButtons={'auto'}
      textColor={'primary'}
    >
      {visibleTabs.map((t) => (
        <TMXTab className={className} values={tabValues} root="trny" key={`tmxtab:${t}`} index={t} />
      ))}
    </Tabs>
  );
}
