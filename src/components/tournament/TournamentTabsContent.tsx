import React from 'react';
import { useSelector } from 'react-redux';

import { useStyles } from 'components/tournament/styles';
import { TabPanel } from 'components/tabs/TabPanel';

import {
  TAB_EVENTS,
  TAB_MATCHUPS,
  TAB_PLAYERS,
  TAB_SETTINGS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_TOURNAMENT
} from 'stores/tmx/types/tabs';

import { InformationPanel } from 'components/panels/infoPanel/InformationPanel';
import { EventsPanel } from 'components/panels/eventsPanel/EventsPanel';
import { SettingsPanel } from 'components/panels/SettingsPanel';
import { PlayersPanel } from 'components/panels/participantsPanel/ParticipantsPanel';
import { MatchesPanel } from 'components/panels/MatchUpsPanel';
import { SchedulePanel } from 'components/panels/SchedulePanel';
import { LocationsPanel } from 'components/panels/locationsPanel/LocationsPanel';

const TournamentTabsContent = () => {
  const classes = useStyles();

  const visibleTabs = useSelector((state: any) => state.tmx.visible.tabs);
  const visibleTabPanel = useSelector((state: any) => state.tmx.visible.tabPanel) || visibleTabs[0];

  return (
    <div className={classes.pageWrapper}>
      <TabPanel value={visibleTabPanel} index={TAB_TOURNAMENT}>
        <InformationPanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_PLAYERS}>
        <PlayersPanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_EVENTS}>
        <EventsPanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_LOCATIONS}>
        <LocationsPanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_SCHEDULE}>
        <SchedulePanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_MATCHUPS}>
        <MatchesPanel />
      </TabPanel>
      <TabPanel value={visibleTabPanel} index={TAB_SETTINGS}>
        <SettingsPanel />
      </TabPanel>
    </div>
  );
};

export default TournamentTabsContent;