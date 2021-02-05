import { version } from './version';
import {
  TAB_TOURNAMENT,
  TAB_PARTICIPANTS,
  TAB_EVENTS,
  TAB_LOCATIONS,
  TAB_SCHEDULE,
  TAB_MATCHUPS,
  TAB_SETTINGS
} from '../stores/tmx/types/tabs';
import { COMPONENT_SPLASH, COMPONENT_CALENDAR, COMPONENT_TOURNAMENT } from '../stores/tmx/types/components';
import { MENU_PARTICIPANT, ASSIGNED_PLAYER, MATCH_UMPIRE } from '../stores/tmx/types/menus';

export const env = {
  version,
  template: 'tmx',
  visibleTabs: [TAB_TOURNAMENT, TAB_PARTICIPANTS, TAB_EVENTS, TAB_LOCATIONS, TAB_SCHEDULE, TAB_MATCHUPS, TAB_SETTINGS],
  enabledComponents: [COMPONENT_SPLASH, COMPONENT_CALENDAR, COMPONENT_TOURNAMENT],
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

  menuOptions: {
    delegation: true,
    drawDateTime: false,
    byeReplacement: true
  },

  // dev secret can be set with a key
  // when dev secret = dev value in queryString util.addDev globals are available
  dev: undefined,
  socketIo: { tmx: '/tmx' }, // should be set as part of authenticated connection

  firstTimeUser: false,

  version_check: undefined,
  formatVersion: '1.7',

  ioc: 'gbr',
  orientation: undefined,
  ui_behaviors: {
    hide_events_list: false,
    hide_events_on_add_event: true,
    highlight_cross_team_doubles_pairings: false,
    highlight_same_team_singles_pairings: false,
    modals: { drawer: true }
  },
  documentation: {
    links: true,
    localhelp: false,
    helptext: undefined
  },
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
  metadata: {
    exchange_formats: {
      oops: '1.0',
      matches: '1.0',
      tournaments: '1.0'
    }
  },
  exports: {
    itf: false, // can be JSON, XML, or CSV... if not false then default to CSV
    utr: false,
    statCrew: false,
    person_data: false,
    localStorage: false
  },
  uploads: {
    matches: false
  },
  locations: {
    geolocate: true,
    geoposition: undefined
  },
  calendar: {
    addTournaments: true,
    syncTournament: false,
    first_day: 0
  },
  teams: {
    display: true,
    merge: { replace: false }
  },
  players: {
    display: {
      ioc: true,
      school: true
    },
    pinid: false, // whether or not to allow editing of pinid?
    ratings: {
      display: false
    },
    merge: true,
    autoUpdate: false,
    identify: true,
    require: { ioc: false },
    adding: { playersTab: true },
    fetching: { googleSheets: false },
    section_scroll: false,
    enable_local_add: true,
    editing: {
      birth: true,
      sex: true,
      pinid: ''
    },
    highlight_guid: false,
    refreshing: { deletereplace: false }, // whether it should be default behavior
    gender_separation: false,
    approving: {
      re_rank: false,
      click_qualify: false,
      modify_seeding: false,
      modify_ranking: false
    },
    ranking: {
      singles: { high_value: false },
      doubles: { high_value: false }
    },
    sign_in: {
      rapid: true
    }
  },
  matches: {
    save: false
  },
  points: {
    save: false,
    walkover_wins: ['QF', 'SF', 'F'],
    points_table: {
      validity: [{ from: '1900-01-01', to: '2100-12-31', table: 'default' }],
      tables: {
        default: {
          categories: {
            All: {},
            U10: { ages: { from: 7, to: 10 } },
            U12: { ages: { from: 9, to: 12 } },
            U14: { ages: { from: 10, to: 14 } },
            U16: { ages: { from: 12, to: 16 } },
            U18: { ages: { from: 13, to: 18 } },
            ELO: { ratings: { type: 'elo' } },
            WTN: { ratings: { type: 'wtn' } },
            'WTN-D': { ratings: { type: 'wtnd' } },
            UTR: { ratings: { type: 'utr' } },
            'UTR-D': { ratings: { type: 'utrd' } },
            NTRP: { ratings: { type: 'ntrp' } },
            Adult: { ages: { from: 16, to: 40 } },
            Senior: { ages: { from: 35, to: 100 } }
          },
          rankings: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {} }
        }
      }
    }
  },
  parsers: {},
  tournaments: {
    dual: true,
    team: false,
    league: false,
    editing: {
      require_auth: false
    }
  },
  scoring: {
    flags: true
  },
  draws: {
    seeds: {
      custom_limits: true,
      allow_modify: false,
      restrict_placement: true
    },
    doubles: {
      pair_alternates: false,
      links: false
    },
    autodraw: true,
    autobyes: true,
    dual: {
      elimination: true,
      roundrobin: true
    },
    types: {
      elimination: true,
      qualification: true,
      roundrobin: true,
      consolation: true,
      compass: true,
      playoff: true,
      adhoc: true
    },
    subtypes: {
      qualification: {
        preround: true,
        incidentals: false
      }
    },
    structures: {
      feedin: {
        elimination: true,
        consolation: true
      },
      backdraw: true
    },
    compass_draw: {
      fluid: false
    },
    adhoc: {
      minimums: {
        singles: 2,
        doubles: 2
      },
      team_codes: false,
      elo: false // whether or not to calculate using ELO between rounds
    },
    tree_draw: {
      seeds: { color: 'black' },
      flags: { display: true },
      display: { teams: true },
      schedule: {
        times: false,
        military: true,
        dates: false,
        courts: false,
        identifiers: true,
        after: false
      },
      details: {
        draw_positions: true,
        player_rankings: true,
        player_ratings: true
      },
      minimums: {
        team: 2,
        singles: 2,
        doubles: 2
      },
      round_limits: false,
      compressed: {
        byes_adjacent_to_seeds: false
      }
    },
    rr_draw: {
      seeds: { color: 'black' },
      doubles: true,
      minimums: {
        team: 3,
        singles: 3,
        doubles: 3
      },
      details: {
        draw_positions: true,
        player_rankings: true,
        player_ratings: false,
        club_codes: true,
        draw_entry: true,
        seeding: true,
        won_lost: true,
        games_won_lost: false,
        bracket_order: true
      },
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
  publishing: {
    broadcast: true,
    livescore: true,
    require_confirmation: false,
    publish_on_score_entry: true,
    publish_draw_creation: false
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
  storage: undefined,
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
  device: {},
  actions: {
    finish2calendar: true
  }
};
