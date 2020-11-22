import {
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_MATCHUPS,
  TAB_PARTICIPANTS,
  TAB_SCHEDULE,
  TAB_SETTINGS
} from 'stores/tmx/types/tabs';

import {
  DRAWS,
  EVENTS,
  LOCATIONS,
  MATCHUPS,
  PARTICIPANTS,
  SCHEDULE,
  SETTINGS,
  TOURNAMENT
} from 'config/router/constants';

export const tabRoute = ({ tournamentId, tabIndex }) => {
  switch (tabIndex) {
    case TAB_SETTINGS:
      return `/${TOURNAMENT}/${tournamentId}/${SETTINGS}`;
    case TAB_LOCATIONS:
      return `/${TOURNAMENT}/${tournamentId}/${LOCATIONS}`;
    case TAB_PARTICIPANTS:
      return `/${TOURNAMENT}/${tournamentId}/${PARTICIPANTS}`;
    case TAB_EVENTS:
      return `/${TOURNAMENT}/${tournamentId}/${EVENTS}`;
    case TAB_MATCHUPS:
      return `/${TOURNAMENT}/${tournamentId}/${MATCHUPS}`;
    case TAB_SCHEDULE:
      return `/${TOURNAMENT}/${tournamentId}/${SCHEDULE}`;
    default:
      return `/${TOURNAMENT}/${tournamentId}`;
  }
};

export const eventRoute = ({ tournamentId, eventId }) => {
  if (eventId) return `/${TOURNAMENT}/${tournamentId}/${EVENTS}/${eventId}`;
  return `/${TOURNAMENT}/${tournamentId}/${EVENTS}`;
};
export const drawRoute = ({ tournamentId, drawId, eventId }) => {
  if (drawId) return `/${TOURNAMENT}/${tournamentId}/${DRAWS}/${drawId}`;
  if (eventId) return `/${TOURNAMENT}/${tournamentId}/${EVENTS}/${eventId}`;
  return `/${TOURNAMENT}/${tournamentId}/${EVENTS}`;
};
export const locationRoute = ({ tournamentId, locationId }) => {
  if (locationId) return `/${TOURNAMENT}/${tournamentId}/${LOCATIONS}/${locationId}`;
  return `/${TOURNAMENT}/${tournamentId}/${LOCATIONS}`;
};
