import React from 'react';

import { useStyles } from 'components/tournament/styles';
import { TabPanel } from 'components/tabs/TabPanel';

import {
  TAB_EVENTS,
  TAB_MATCHUPS,
  TAB_PARTICIPANTS,
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

const TournamentTabsContent = ({ tabIndex, tournamentRecord, params }) => {
  const classes = useStyles();
  const { tournamentId } = tournamentRecord;

  return (
    <div className={classes.pageWrapper}>
      <TabPanel value={tabIndex} index={TAB_TOURNAMENT}>
        <InformationPanel tournamentRecord={tournamentRecord} params={params} />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_PARTICIPANTS}>
        <PlayersPanel tournamentId={tournamentId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_EVENTS}>
        <EventsPanel tournamentRecord={tournamentRecord} params={params} />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_LOCATIONS}>
        <LocationsPanel tournamentId={tournamentId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_SCHEDULE}>
        <SchedulePanel tournamentId={tournamentId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_MATCHUPS}>
        <MatchesPanel />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_SETTINGS}>
        <SettingsPanel tournamentId={tournamentId} />
      </TabPanel>
    </div>
  );
};

export default TournamentTabsContent;
