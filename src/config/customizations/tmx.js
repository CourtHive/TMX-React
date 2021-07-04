import { version } from './version';
import {
  TAB_TOURNAMENT,
  TAB_PARTICIPANTS,
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_MATCHUPS
} from '../stores/tmx/types/tabs';
import { MENU_PARTICIPANT, ASSIGNED_PLAYER, MATCH_UMPIRE } from '../stores/tmx/types/menus';

export const env = {
  version,
  template: 'tmx',
  visibleTabs: [TAB_TOURNAMENT, TAB_PARTICIPANTS, TAB_EVENTS, TAB_LOCATIONS, TAB_SCHEDULE, TAB_MATCHUPS],
  enabledPDFs: [TAB_PARTICIPANTS, TAB_EVENTS, TAB_SCHEDULE, TAB_MATCHUPS],

  enabledMenus: [MENU_PARTICIPANT, ASSIGNED_PLAYER, MATCH_UMPIRE],

  visibleButtons: {
    zoom: true,
    publish: true,
    mainMenu: true,
    addDraw: true,
    addEvent: true,
    playerActions: true,
    modifyRankings: true,
    representatives: true,
    addParticipant: true,
    addParticipants: true
  },

  // dev secret can be set with a key
  // when dev secret = dev value in queryString util.addDev globals are available
  dev: undefined,
  socketIo: { tmx: '/tmx' }, // should be set as part of authenticated connection

  version_check: undefined,
  formatVersion: '1.7',

  ioc: 'gbr',
  orientation: undefined,
  org: {
    name: undefined,
    abbr: undefined,
    ouid: undefined,
    keys: { referee: undefined } // used for auth key generation
  },
  assets: {
    flags: '/media/flags/',
    imageRoot: './assets/',
    splash: 'courthive.png',
    pdf: {
      nameImage: 'courthive.png',
      logoImage: 'courthive.png'
    }
  },
  calendar: {
    addTournaments: true,
    syncTournament: false,
    first_day: 0
  },
  draws: {
    rr_draw: {
      brackets: {
        min_bracket_size: 3,
        default_bracket_size: 4,
        max_bracket_size: 8
      }
    }
  },
  printing: {
    pageSize: 'A4',
    save_pdfs: false,
    schedule: {
      header: true,
      footer: true,
      courts_per_page: 8
    },
    drawsheets: {
      header: true,
      footer: true
    }
  },
  schedule: {
    teams: true,
    clubs: true,
    time24: false,
    ioc_codes: false,
    default_time: '9:00',
    scores_in_draw_order: true,
    completed_matches_in_search: false,
    max_matches_per_court: 14,
    court_identifiers: true
  },
  messages: [],
  notifications: undefined,
  server: {
    send: {
      active: true,
      disable: false,
      noMixedTeams: false,
      singleTournaments: true,
      blockGUIDplayers: false,
      onlyCompletedMatches: false,
      tournamentParticipants: true,
      convertTeamEventStructures: true
    },
    sync: {
      tournaments: true,
      players: true,
      clubs: true
    },
    push: {
      auto: false,
      period: 200000,
      emitTmx: ['pushTODS']
    },
    requests: {
      externalRequest: [
        'fetchClubs',
        'fetchNewPlayers',
        'fetchNewTournaments',
        'fetchRankList',
        'fetchRegisteredPlayers'
      ],
      sheetDataStorage: ['syncPlayers'],
      userInterface: ['defaultIdiom']
    }
  },
  device: {}
};
