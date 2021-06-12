import { COMPONENT_SPLASH, COMPONENT_CALENDAR, COMPONENT_TOURNAMENT } from './types/components';
import {
  TAB_TOURNAMENT,
  TAB_PARTICIPANTS,
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_MATCHUPS,
  PTAB_PARTICIPANTS,
  DTAB_DRAW,
  LTAB_OVERVIEW,
  TTAB_OVERVIEW
} from './types/tabs';

export const storeInitialState = () => ({
  // funcationality disabled until true
  initialized: false,

  // tournament
  records: {},
  selectedTournamentId: null,

  // scoring
  scoringTieMatchUp: null,

  // calendar
  category: undefined,
  startDate: new Date(),

  // refresh
  keyLoads: 0,
  drawResize: 0,

  authState: false,
  editState: true,
  loginModal: false,
  loadingState: false,
  pubAction: undefined,
  content: COMPONENT_SPLASH,
  toasterState: {
    visible: null,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center'
    },
    severity: 'success',
    message: ''
  },
  editMode: {
    eventParticipants: false,
    drawParticipants: false,
    participantList: false,
    eventDrawList: false,
    eventList: false
  },
  actionData: {
    autoDraw: undefined,
    swapDrawPosition: undefined
  },
  hiddenColumns: {
    teams: [],
    groups: [],
    locations: [],
    tournaments: ['provider'],
    draws: ['scheduled', 'completed'],
    events: ['rank', 'indoorOutdoor', 'surfaceCategory'],
    matchUps: ['event', 'format', 'scheduleTime', 'startTime', 'endTime', 'umpire'],
    eventParticipants: ['firstName', 'lastName', 'seedPosition', 'otherName', 'ioc'],
    participants: ['firstName', 'lastName', 'otherName', 'ioc']
  },
  select: {
    draws: { draw: '', structureId: '', zoom: undefined, round: '-' },
    events: { event: '-' },
    venues: { venue: '-' },
    matchUps: { team: '-' },
    players: { team: '-' },
    assignment: { team: '-' },
    schedule: {
      day: '-',
      team: '-',
      courts: '-',
      event: '-',
      draw: '-',
      round: '-'
    },
    participants: {
      sex: 'X',
      category: '-',
      signedIn: '-'
    }
  },
  enabled: {
    components: {
      [COMPONENT_SPLASH]: true,
      [COMPONENT_CALENDAR]: true,
      [COMPONENT_TOURNAMENT]: true
    }
  },
  visible: {
    tabs: [TAB_TOURNAMENT, TAB_PARTICIPANTS, TAB_EVENTS, TAB_LOCATIONS, TAB_SCHEDULE, TAB_MATCHUPS],
    tabState: 'none',
    dialog: undefined,
    drawer: undefined,
    mainMenu: undefined,
    tabPanel: undefined,
    drawView: DTAB_DRAW,
    locationView: LTAB_OVERVIEW,
    tournamentView: TTAB_OVERVIEW,
    participantView: PTAB_PARTICIPANTS,
    dualMatch: undefined,
    alertDialog: undefined,
    drawActive: undefined,
    locationsList: undefined,
    unscheduledMatches: undefined
  },
  drawData: undefined
});

export default storeInitialState;
