import React from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { Tooltip, Tabs, useMediaQuery } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EventIcon from '@material-ui/icons/EmojiEvents';
import SettingsIcon from '@material-ui/icons/Settings';
// import DateRangeIcon from '@material-ui/icons/DateRange';

import MatchUpsIcon from 'components/icons/MatchUpsIcon';

import { TMXTab } from 'components/tabs/TMXTab';

import {
  TAB_TOURNAMENT,
  TAB_PLAYERS,
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_MATCHUPS,
  TAB_SETTINGS,
} from 'stores/tmx/types/tabs';
import { useStyles } from 'components/tournament/styles';
import useTheme from '@material-ui/core/styles/useTheme';

export function TournamentTabs() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const theme = useTheme();
  const mediaBreakpoints = useMediaQuery(theme.breakpoints.up('xs'));
  const iconTabs = useSelector((state: any) => state.tmx.visible.iconTabs);

  const downXs = useMediaQuery(theme.breakpoints.down('xs'));

  const labelMaker = (icon, label) => !iconTabs ? t(label) :
    <Tooltip title={t(label)} aria-label={t(label)}>
      {icon}
    </Tooltip>;

  const infoLabel = labelMaker(<InfoIcon />, 'Information');
  const groupLabel = labelMaker(<GroupIcon />, 'Participants');
  const locationLabel = labelMaker(<LocationOnIcon />, 'Locations');
  const scheduleLabel = labelMaker(<ScheduleIcon />, 'Schedule');
  const matchUpsLabel = labelMaker(<MatchUpsIcon />, 'Matches');
  const eventsLabel = labelMaker(<EventIcon />, 'Events');
  const settingsLabel = labelMaker(<SettingsIcon />, 'Settings');
    
  const tabValues = {
    [TAB_TOURNAMENT]: { label: infoLabel, id: 'tab-tournament' },
    [TAB_PLAYERS]: { label: groupLabel, id: 'tab-participants' },
    [TAB_EVENTS]: { label: eventsLabel, id: 'tab-events' },
    [TAB_LOCATIONS]: { label: locationLabel, id: 'tab-locations' },
    [TAB_SCHEDULE]: { label: scheduleLabel, id: 'tab-schedule' },
    [TAB_MATCHUPS]: { label: matchUpsLabel, id: 'tab-matchUps' },
    [TAB_SETTINGS]: { label: settingsLabel, id: 'tab-settings' }
  };

  const handleChange = (_, newValue) => {
    const iconTabs = downXs;
    const activeTab = visibleTabs[newValue];
    dispatch({ type: 'change active tab', payload: { tab: activeTab, iconTabs }});
  };

  const visibleTabs = useSelector((state: any) => state.tmx.visible.tabs);
  const visibleTabPanel = useSelector((state: any) => state.tmx.visible.tabPanel) || visibleTabs[0];

  const tabIndex = visibleTabs.indexOf(visibleTabPanel);
  const value = tabIndex >= 0 ? tabIndex : 0;

  if (!visibleTabPanel && visibleTabs.length) {
    dispatch({ type: 'change active tab', payload: { tab: visibleTabs[0] }});
  }

  const className = mediaBreakpoints ? classes.tab : classes.tabSm;
  return (
    <Tabs
      value={value}
      orientation='vertical'
      aria-label={'tournament tabs'}
      indicatorColor={'primary'}
      onChange={handleChange}
      variant={'scrollable'}
      scrollButtons={'auto'}
      textColor={'primary'}
    >
      {visibleTabs.map((t) => (
        <TMXTab className={className} values={tabValues} root='trny' key={`tmxtab:${t}`} index={t} />
      ))}
    </Tabs>
  );
}
