// import { tournamentEngine, utilities } from 'tods-competition-factory';

export const printFx = (function () {
  const fx = {};
  /*

   function emittedPDFrequest({event}) {
      let mouse = {
         x: event.clientX,
         y: event.clientY,
         pageX: event.pageX,
         pageY: event.pageY
      }
      contextPDF(event.target, mouse);
   }

   function contextPDF(target, mouse) {
      let visibleTabPanel = tmxStore.getState().tmx.visible.tabPanel;
      let actions = {
         [TAB_EVENTS]: () => printDraw(target, mouse),
         [TAB_PARTICIPANTS]: () => playersTabPDFs(target, mouse),
         [TAB_MATCHUPS]: () => allMatches(),
         [TAB_SCHEDULE]: () => printSchedule(target, mouse)
      }
      if (actions[visibleTabPanel]) actions[visibleTabPanel]();
   }

   function playersTabPDFs(target, mouse) {
      let sgnd_alpha = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => playersListPDF({alpha: true, onlySignedIn: true}),
            className: 'pt-sgnd-alpha-open', intent: 'success'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => playersListPDF({alpha: true, onlySignedIn: true, download: true}),
            className: 'pt-sgnd-alpha-save', intent: 'success'
         }
      ];

      let sgnd_numeric = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => playersListPDF({alpha: false, onlySignedIn: true}),
            className: 'pt-sgnd-number-open', intent: 'success'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => playersListPDF({alpha: false, onlySignedIn: true, download: true}),
            className: 'pt-sgnd-number-save', intent: 'success'
         }
      ];

      let sgnd = [
         { icon: 'sort-alphabetical', title: i18n.t('alpha'), subMenu: sgnd_alpha, className: 'pt-ranked-alpha', intent: 'success' },
         { icon: 'sort-numerical', title: i18n.t('rlo'), subMenu: sgnd_numeric, className: 'pt-ranked-number', intent: 'success' }
      ];

      let pls_alpha = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => playersListPDF({alpha: true}),
            className: 'pt-plist-alpha-open', intent: 'primary'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => playersListPDF({alpha: true, download: true}),
            className: 'pt-plist-alpha-save', intent: 'primary'
         }
      ];

      let pls_numeric = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => playersListPDF({alpha: false}),
            className: 'pt-plist-number-open', intent: 'primary'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => playersListPDF({alpha: false, download: true}),
            className: 'pt-plist-number-save', intent: 'primary'
         }
      ];

      let pls = [
         { icon: 'sort-alphabetical', title: i18n.t('alpha'), subMenu: pls_alpha, className: 'pt-ranked-alpha', intent: 'primary' },
         { icon: 'sort-numerical', title: i18n.t('rlo'), subMenu: pls_numeric, className: 'pt-ranked-number', intent: 'primary' }
      ];

      let sso_alpha = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => signInPDF({alpha: true}),
            className: 'pt-sglsgn-alpha-open', intent: 'primary'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => signInPDF({alpha: true, download: true}),
            className: 'pt-sglsgn-alpha-save', intent: 'primary'
         }
      ];

      let sso_numeric = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => signInPDF({rank: true}),
            className: 'pt-sglsgn-number-open', intent: 'primary'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => signInPDF({rank: true, download: true}),
            className: 'pt-sglsgn-number-save', intent: 'primary'
         }
      ];

      let sso = [
         { icon: 'sort-alphabetical', title: i18n.t('alpha'), subMenu: sso_alpha, className: 'pt-ranked-alpha', intent: 'primary' },
         { icon: 'sort-numerical', title: i18n.t('rlo'), subMenu: sso_numeric, className: 'pt-ranked-number', intent: 'primary' }
      ];

      let dso = [
         {
            icon: 'document-open', title: i18n.t('settings.opentabs'),
            onClick: () => doublesSignInPDF({downlaod: false}),
            className: 'pt-dblsgn-open', intent: 'primary'
         },
         {
            icon: 'floppy-disk', title: i18n.t('settings.savepdfs'),
            onClick: () => doublesSignInPDF({download: true}),
            className: 'pt-dblsgn-save', intent: 'primary'
         }
      ];

      let options = [
         { icon: 'person', title: i18n.t('signin.signedin'), subMenu: sgnd, className: 'pt-signedin', intent: 'success' },
         { icon: 'person', title: i18n.t('draws.playerrange'), subMenu: pls, className: 'pt-player-list', intent: 'primary' },
         { icon: 'th-list', title: `${i18n.t('sgl')} ${i18n.t('print.signin')}`, subMenu: sso, className: 'pt-singles-signin', intent: 'primary' },
         { icon: 'confirm', title: `${i18n.t('dbl')} ${i18n.t('print.signin')}`, subMenu: dso, className: 'pt-doubles-signin', intent: 'primary' }
      ];
      mnu.open({ mouse, options });
   }

   function matchListPDF({ type } = {}) {
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      let { total_matches, upcoming_matches, completed_matches, pending_matches } = tournamentEventMatches({ tournament, source: true, env });
      if (!total_matches) return;

      let download = env.printing.save_pdfs;
      const selectedTeamId = tmxStore.getState().tmx.select.matchUps.team;
      let selected_team = selectedTeamId && tournament.teams && tournament.teams.reduce((p, c) => (c.id || c.uuid) === selectedTeamId ? c : p, undefined);
      let team_player_ids = selected_team && Object.keys(selected_team.players).length && Object.keys(selected_team.players);

      pending_matches = pending_matches.filter(matchUp => !team_player_ids || opponentsInclude({ matchUp, ids: team_player_ids }))
      upcoming_matches = upcoming_matches.filter(matchUp => !team_player_ids || opponentsInclude({ matchUp, ids: team_player_ids, potentials: true }))
      completed_matches = completed_matches.filter(matchUp => !team_player_ids || opponentsInclude({ matchUp, ids: team_player_ids }))

      let matches = [].concat(...pending_matches, ...completed_matches, ...upcoming_matches);
      if (!matches.length) { return xxx.inform({ message: 'No Matches to Print'}); }

      exportPDF.matchesList({ tournament, team: selected_team, type, pending_matches, completed_matches, upcoming_matches, download });
   }

   function allMatches() {
      matchListPDF();
   }

   function printDraw(target, mouse) {
     
      // get currently selected drawId

      const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
      const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);

      let state = tmxStore.getState();
      const selectedDraw = state.tmx.select.draws.draw;
      const drawDefinitions = (tournamentRecord.events || []).map(event => event.drawDefinitions || []).flat();
      const drawExists = selectedDraw && drawDefinitions.reduce((p, c) => c.drawId === selectedDraw ? c : p, undefined);
      const firstDraw = drawDefinitions && drawDefinitions.length && drawDefinitions[0].drawId;
      const drawId = (drawExists && selectedDraw) || firstDraw;
      
      if (!drawId) return;

      console.log('print PDF');
      if (drawId) return;

      const e = 'foo';

      let current_draw = e && e.draw.compass ? e.draw[e.draw.compass] : e && e.draw;
      let qualifying = current_draw && tc.isQualifying({e});
      let lucky_losers = qualifying ? drawInfo(current_draw).complete : undefined;

      let adhoc_matches = tc.isAdHoc({e}) && e && e.draw && e.draw.matches;
      let selectedRound = tmxStore.getState().tmx.select.draws.round;
      if (adhoc_matches && selectedRound && !isNaN(selectedRound)) {
         adhoc_matches = adhoc_matches.filter(m=>m.round === parseInt(selectedRound));
      }

      // let tree = e && Object.keys(context.tree_draw.data()).length;
      let rr = e && context.rr_draw && context.rr_draw.data().brackets && context.rr_draw.data().brackets.length;
      // let data = tree ? context.tree_draw.data() : rr ? context.rr_draw.data() : undefined;
      // let options = tree ? context.tree_draw.options() : rr ? context.rr_draw.options() : undefined;
      let data = rr ? context.rr_draw.data() : undefined;
      let options = rr ? context.rr_draw.options() : undefined;
      let selectedEvent = tmxStore.getState().tmx.select.event;

      // eslint-disable-next-line
      let url = `${location.origin}/pdf/${euid}`;

      let pdo = [
         { icon: 'document-open', title: i18n.t('settings.opentabs'), onClick: ()=>printDrawOrder({evt: e}), className: 'pd-opentabs', intent: 'primary' },
         { icon: 'floppy-disk', title: i18n.t('settings.savepdfs'), onClick: ()=>printDrawOrder({evt: e, download: true }), className: 'pd-savepdfs', intent: 'primary' }
      ];

      let pdd = [
         { icon: 'document-open', title: i18n.t('settings.opentabs'), onClick: printPDF, className: 'pd-opentabs', intent: 'primary' },
         { icon: 'feed', title: i18n.t('print.publishpdf'), onClick: ()=>printPDF({emit: true }), className: 'pd-publish-pdf', intent: 'primary' },
         { icon: 'floppy-disk', title: i18n.t('settings.savepdfs'), onClick: ()=>printPDF({download: true }), className: 'pd-savepdfs', intent: 'primary' }
      ];

      let llss = [
         { icon: 'document-open', title: i18n.t('settings.opentabs'), onClick: printLLSignIn, className: 'pd-opentabs', intent: 'primary' },
         { icon: 'floppy-disk', title: i18n.t('settings.savepdfs'), onClick: ()=>printLLSignIn({download: true }), className: 'pd-savepdfs', intent: 'primary' }
      ];

      let mnu_options = [
         { icon: '', title: `${i18n.t('draws.luckyloser')} ${i18n.t('print.signin')}`, disabled: !created || !lucky_losers, subMenu: llss, className: 'pd-ll-signin', intent: 'primary' },
         { icon: '', title: i18n.t('mdo'), subMenu: pdo, className: 'pd-draw-order', intent: 'primary' },
         { icon: '', title: i18n.t('drw'), subMenu: pdd, className: 'pd-draw', intent: 'primary' }
      ];

      mnu.open({ mouse, options: mnu_options });

      function printPDF({download, emit}={}) {
         // let dualMatchId = tmxStore.getState().tmx.visible.dualMatch;
         // console.log({dualMatchId});

         // let dual_teams = dualMatchId && tdFx.getDualTeams(dual_match);
         // let dual_matches = dualMatchId && tieMatchUps(e, dualMatchId);
         try {
            exportPDF.printDrawPDF({
               data,
               emit,
               options,
               event: e,
               download,
               callback,
               tournament,
               // dual_teams,
               // dual_match,
               // dual_matches,
               adhoc_matches,
               selectedEvent
            });
         }
         catch (err) { util.logError(err); }

         function callback() {
            let copied = <div> <a target="_blank" rel="noopener noreferrer" href="{url}">{i18n.t('phrases.linkcopied')}</a> </div>;
            let message = emit ? copied : '';
            if (message) { return xxx.inform({ message }); }
         }
      }

      function printLLSignIn({download}={}) {
         let { losing_players } = getLuckyLosers({ tournament, evnt: e, env });

         exportPDF.orderedPlayersPDF({
            download,
            tournament,
            event_name: e.name,
            players: losing_players,
            doc_name: `${i18n.t('draws.luckyloser')} ${i18n.t('print.signin')}`,
            extra_pages: false
         });
      }
   }

   function printSchedule(target, mouse) {
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      let selected_day = tmxStore.getState().tmx.select.schedule.day;
      let { completed_matches, pending_matches, upcoming_matches } = tournamentEventMatches({ tournament, source: true, env });
      let all_matches = completed_matches.concat(...pending_matches, ...upcoming_matches);

      // determine if there is a location filter
      let luids = util.safeArr(tournament.locations).map(l=>l.luid);
      let luid = luids.length === 1 ? luids[0] : container.location_filter.ddlb.getValue();

      let courts = [];
      let day_matches = all_matches.filter(matchUp => sfx.scheduledFilter({selected_day, matchUp, context}));

      let scheduled_courts = utilities.unique(day_matches.map(m=>`${m.schedule.luid}|${m.schedule.index}`));
      let filtered_courts = courts.filter(c=>scheduled_courts.indexOf(`${c.luid}|${c.index}`) >= 0);

      let disabled = !day_matches || !day_matches.length;

      let options = [
         { icon: 'floppy-disk', title: i18n.t('settings.savepdfs'), disabled, onClick: downloadSchedulePDF, className: 'ps-savepdfs', intent: 'primary' },
         { icon: 'document-open', title: i18n.t('settings.opentabs'), disabled, onClick: openScheduleTabs, className: 'ps-opentabs', intent: 'primary' }
      ];
      mnu.open({ mouse, options });

      function downloadSchedulePDF() { goPrintSchedule({download: true}); }
      function openScheduleTabs() { goPrintSchedule({download: false}); }

      function goPrintSchedule({download}={}) {
         let schedule_day = tmxStore.getState().tmx.select.schedule.day;
         exportPDF.printSchedulePDF({
            download,
            tournament,
            matches: day_matches,
            courts: filtered_courts,
            day: schedule_day
         });
      }
   }

   function printDrawOrder({ evt, download }) {
      let euid = context.displayed.draw_event && context.displayed.draw_event.euid;
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      evt = evt || findDrawDefinitionById({drawId: euid});

      // if no event or no approved players or category undefined, abort
      if (evt && evt.approved && evt.category) {
         let category = evt.category;
         let t_players;
         if (evt.format === 'D') {
            let teams = approvedDoubles({ tournament, e: evt })
               .map(team => team.players.map(player => Object.assign(player, { seed: team.seed })));
            return exportPDF.doublesSignInPDF({
               teams,
               download,
               tournament,
               doc_name: `${i18n.t('dbl')} ${i18n.t('print.signin')}`
            });
         } else {
            t_players = tournament.players
               .filter(player=>evt.approved.indexOf(player.id) >= 0)
               .filter(player=>player.signed_in);
         }

         if (t_players && t_players.length) {
            t_players = tfx.orderPlayersByRank(t_players, category);

            // configured for listing players by Position in draw "Draw Order"
            exportPDF.orderedPlayersPDF({
               download,
               tournament,
               extra_pages: false,
               players: t_players,
               event_name: evt.name,
               doc_name: i18n.t('mdo')
            });
         }
      }
   }

   function signInPDF({alpha}={}) {
      let download = env.printing.save_pdfs;
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      let tournament_date = tournament && tournament.startDate;
      let calc_date = offsetDate(tournament_date);
      let doubles = context.player_views.doubles_rankings;
      let category = container.category_filter.ddlb.getValue();
      let ranked_players = tfx.orderPlayersByRank(tournament.players, category, doubles);
      let t_players = ranked_players
         .filter(player=>context.filters.indexOf(player.sex) < 0)
         .filter(player => !category || category === '-' || pfx.eligibleForCategory({ calc_date, category, player }))
         .filter(player=>(player.withdrawn === 'N' || !player.withdrawn) && !player.signed_in)
         .sort(signSort)

      if (!t_players) return;      

      exportPDF.orderedPlayersPDF({
         download,
         tournament,
         players: t_players,
         doc_name: `${i18n.t('sgl')} ${i18n.t('print.signin')}`
      });

      function signSort(a, b) {
         if (alpha) return stringSort(a.last_name, b.last_name);
      }
   }

   function doublesSignInPDF({ download }={}) {
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      exportPDF.doublesSignInPDF({
         download,
         tournament,
         doc_name: `${i18n.t('dbl')} ${i18n.t('print.signin')}`
      });
   }

   function playersListPDF({alpha, onlySignedIn, download}={}) {
      download = download || env.printing.save_pdfs;
      const { tournamentRecord: tournament } = tournamentEngine.getState();
      let doubles = context.player_views.doubles_rankings;

      let selected_category = (container.category_filter && container.category_filter.ddlb && container.category_filter.ddlb.getValue()) || tournament.category;
      let category = selected_category && selected_category.toLowerCase();

      let ranked_players = tfx.orderPlayersByRank(tournament.players, category, doubles);
      let t_players = ranked_players.filter(genderFiltered).filter(notWithdrawn).filter(signedIn);
      if (!t_players) return;      

      if (alpha) { t_players.sort(pfx.lastNameSort); }

      exportPDF.playerList({
         download,
         tournament,
         players: t_players,
         doc_name: `${i18n.t('print.playerlist')}`,
         attributes: { club: true, rank: true, rating: true, ioc: true, school: true, year: true, sex: true, category }
      });

      function genderFiltered(p) { return context.filters.indexOf(p.sex) < 0; }
      function notWithdrawn(p) { return p.withdrawn === 'N' || !p.withdrawn; }
      function signedIn(p) { return !onlySignedIn || p.signed_in; }
   }
   */

  return fx;
})();
