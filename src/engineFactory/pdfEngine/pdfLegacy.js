import { env } from 'config/defaults';
import { qrFx } from 'services/qrFx';
import { drawInfo } from 'functions/draws/querying/drawInfo';

import { tmxStore } from 'stores/tmxStore';

import { selectAll as d3SelectAll } from 'd3';

import { getLogo } from 'services/imageHandlers/getImage';

import i18n from 'i18next';

import { drawSheet } from 'engineFactory/pdfEngine/draws/drawSheet';
import { dualSheet } from 'engineFactory/pdfEngine/matches/dualSheet';
import { matchesList } from 'engineFactory/pdfEngine/matches/matchesList';
import { matchesByTime } from 'engineFactory/pdfEngine/matches/matchesByTime';
import { matchesByCourt } from 'engineFactory/pdfEngine/matches/matchesByCourt';

import { renderTreeDraw } from 'engineFactory/pdfEngine/svgGeneration/renderTreeDraw';
import { renderRoundRobinDraw } from 'engineFactory/pdfEngine/svgGeneration/renderRoundRobinDraw';

import { signInSheet } from 'engineFactory/pdfEngine/players/signInSheet';
import { doublesSignInSheet } from 'engineFactory/pdfEngine/players/doublesSignInSheet';

import { tournamentPlayerList } from 'engineFactory/pdfEngine/players/tournamentPlayerList';
import { emitPDF, savePDF, openPDF } from 'services/files/pdf/pdfExport';
import { scheduleDocDefinition } from 'engineFactory/pdfEngine/schedule/scheduleDocDefinition';

import { SVGasURI } from 'engineFactory/pdfEngine/svgGeneration/svgUtilities';
import { utilities } from 'tods-competition-factory';

export const exportPDF = (function () {
  const exp = {};

  const o = {
    rows_per_page: 34,
    minimum_empty: 8
  };

  function exportIt({ docDefinition, filename, euid, callback }) {
    if (filename) {
      return savePDF({ docDefinition, filename });
    } else if (euid) {
      return emitPDF({ docDefinition, euid, callback });
    } else {
      return openPDF({ docDefinition });
    }
  }

  exp.printSchedulePDF = ({ tournament, day, courts, matches, download }) => {
    getLogo().then((logo) => {
      const chunks = utilities.chunkArray(courts, env.printing.schedule.courts_per_page || 8);
      const luids = chunks.map((chunk) => chunk.map((c) => c.luid));
      const court_matches = chunks.map((c, i) => matches.filter((f) => luids[i].indexOf(f.schedule.luid) >= 0));
      chunks.forEach((chunk, i) => {
        schedulePDF({ tournament, day, courts: chunks[i], matches: court_matches[i], logo, download });
      });
    });
  };

  function schedulePDF({ tournament, day, courts, matches, landscape, logo, download }) {
    const { docDefinition } = scheduleDocDefinition({ tournament, day, courts, matches, landscape, logo });

    const filename = download && `${tournament.name} ${i18n.t('print.schedule')}.pdf`;
    exportIt({ docDefinition, filename });
  }

  exp.printDrawPDF = ({
    tournament,
    data,
    adhoc_matches,
    dual_match,
    dual_teams,
    dual_matches,
    options,
    selectedEvent,
    event,
    download,
    emit,
    callback
  }) => {
    const width = 3000;
    tmxStore.dispatch({ type: 'loading state', payload: true });

    if (dual_match || adhoc_matches) {
      const data = { dual_match, dual_teams, dual_matches };
      console.log('TieMatchUpsPDF', { data, adhoc_matches });
      // exp.TieMatchUpsPDF({ tournament, data, adhoc_matches, selectedEvent, event, download, emit });
    }

    getLogo().then((logo) => processDraw(logo));

    function processDraw(logo) {
      const doubles = false;
      // const doubles = tc.isDoubles({e: event});
      if (event && event.draw && event.draw.compass) {
        const directions = ['east', 'west', 'north', 'south', 'northeast', 'northwest', 'southeast', 'southwest'];
        const draws = directions.map((direction) => event.draw[direction]).filter((f) => f);
        Promise.all(
          draws.map((data) => {
            const info = drawInfo(data);
            const title = data.direction[0].toUpperCase() + data.direction.slice(1);
            return treeDrawURI({ info, doubles, data, options, width, title });
          })
        ).then((srcs) => genDrawSheet(srcs, logo), cleanUp);
      } else {
        const info = drawInfo(data);
        if (info && info.draw_type === 'tree') {
          const opponent_count = info && info.draw_positions.length * (doubles ? 2 : 1);
          if (opponent_count <= 64) {
            return exp.treeDrawPDF({ tournament, data, options, selectedEvent, info, event, download, emit, callback });
          } else if (opponent_count > 128) {
            const max_round = data.max_round;
            const quarters = [].concat(...data.children.map((c) => c.children));
            Promise.all(
              quarters.map((quarter) => {
                quarter.max_round = max_round;
                return treeDrawURI({ info, doubles, data: quarter, opponents: data.opponents, options, width });
              })
            ).then((srcs) => addFinalRounds({ info, doubles, srcs, logo }), cleanUp);
          } else {
            Promise.all(
              [0, 1].map((child) => {
                return treeDrawURI({ info, doubles, data, options, width, child });
              })
            ).then((srcs) => addFinalRounds({ info, doubles, srcs, logo }), cleanUp);
          }
        }
        if (info && info.draw_type === 'roundrobin') {
          const rr = renderRoundRobinDraw({ tournament, data, options, selectedEvent, info, event });
          rr.then(handleRender);

          function handleRender({ docDefinition }) {
            const draw_type = '';
            /*
                 if (tc.isElimination({e: event})) draw_type = i18n.t('draws.elimination');
                 if (tc.isRoundRobin({e: event})) draw_type = i18n.t('draws.roundrobin');
                 if (tc.isCompass({e: event})) draw_type = i18n.t('draws.consolation');
                 if (tc.isQualifying({e: event})) draw_type = i18n.t('draws.qualification');
                 if (tc.isPlayoff({e: event})) draw_type = i18n.t('pyo');
                 */
            const ccat = event.category ? `${event.category}_` : '';

            const filename = download && `${ccat}${event.name}${draw_type ? ' ' + draw_type : ''} Draw Sheet.pdf`;
            exportIt({ docDefinition, filename });

            cleanUp();
          }
        }
      }
    }

    function addFinalRounds({ info, doubles, srcs, logo }) {
      data.maxTreeDepth = doubles ? 3 : 4;
      // draw_positions forces draw size parameters
      const draw_positions = Math.min(16, data.opponents.length);
      const drawObject = {
        info,
        doubles,
        data,
        opponents: data.opponents,
        options,
        width,
        draw_positions,
        title: i18n.t('phrases.finalrounds')
      };
      treeDrawURI(drawObject).then(genWithFinals, cleanUp);

      function genWithFinals(finals) {
        data.maxTreeDepth = undefined;
        srcs.push(finals);
        genDrawSheet(srcs, logo);
      }
    }

    function genDrawSheet(srcs, logo) {
      const images = srcs.filter((f) => f).map((src) => ({ src, pct: 100 }));
      const { docDefinition } = drawSheet({ tournament, images, logo, selectedEvent });

      const draw_type = '';
      /*
         if (tc.isElimination({e: event})) draw_type = i18n.t('draws.elimination');
         if (tc.isRoundRobin({e: event})) draw_type = i18n.t('draws.roundrobin');
         if (tc.isCompass({e: event})) draw_type = i18n.t('draws.consolation');
         if (tc.isQualifying({e: event})) draw_type = i18n.t('draws.qualification');
         if (tc.isPlayoff({e: event})) draw_type = i18n.t('pyo');
         */
      const ccat = event.category ? `${event.category}_` : '';

      const filename = download && `${ccat}${event.name}${draw_type ? ' ' + draw_type : ''} Draw Sheet.pdf`;
      exportIt({ docDefinition, filename });

      cleanUp();
    }
  };

  function treeDrawURI({ info, doubles, data, opponents, options, height, width, title, child, draw_positions }) {
    return new Promise((resolve, reject) => {
      const element = renderTreeDraw({ info, doubles, data, opponents, options, width, title, child, draw_positions });
      SVGasURI(element, [], height).then(resolve, reject);
    });
  }

  exp.matchesByTime = ({ tournament, team, type, matches, images = [], download }) => {
    getLogo().then(doIt);
    function doIt(logo) {
      const { docDefinition } = matchesByTime({ tournament, team, type, matches, images, logo });
      const tournamentId = tournament.unifiedTournamentId?.tournamentId || tournament.tournamentId;
      const filename = download && `${tournamentId}_Match_List.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.matchesByCourt = ({ tournament, team, type, matches, images = [], download }) => {
    getLogo().then(doIt);
    function doIt(logo) {
      const { docDefinition } = matchesByCourt({
        tournament,
        team,
        type,
        matches,
        images,
        logo
      });
      const tournamentId = tournament.unifiedTournamentId?.tournamentId || tournament.tournamentId;
      const filename = download && `${tournamentId}_Match_List.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.matchesList = ({ tournament, team, type, pending_matches, completed_matches, images = [], download }) => {
    getLogo().then(doIt);
    function doIt(logo) {
      const { docDefinition } = matchesList({
        tournament,
        team,
        type,
        pending_matches,
        completed_matches,
        images,
        logo
      });
      const filename = download && `${tournament.tournamentId}_Match_List.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.TieMatchUpsPDF = ({ tournament, data, adhoc_matches, selectedEvent, event, images = [], download }) => {
    getLogo().then(doIt);
    function doIt(logo) {
      const { docDefinition } = dualSheet({ tournament, data, adhoc_matches, images, logo, selectedEvent, event });
      const draw_type = '';
      /*
         if (tc.isElimination({e: event})) draw_type = i18n.t('draws.elimination');
         if (tc.isRoundRobin({e: event})) draw_type = i18n.t('draws.roundrobin');
         if (tc.isCompass({e: event})) draw_type = i18n.t('draws.consolation');
         if (tc.isQualifying({e: event})) draw_type = i18n.t('draws.qualification');
         if (tc.isPlayoff({e: event})) draw_type = i18n.t('pyo');
         */

      const ecat = event.category ? `${event.category} ` : '';
      const filename = download && `${ecat}${event.name}${draw_type ? ' ' + draw_type : ''} Draw Sheet.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.treeDrawPDF = ({
    tournament,
    data,
    opponents,
    options,
    images = [],
    selectedEvent,
    info,
    event,
    child,
    download,
    emit,
    callback
  }) => {
    const width = 3000;
    const height = 3300;
    const qr_dim = width / 6.7;
    const title = (event && event.custom_category) || '';

    return new Promise((resolve, reject) => {
      const doubles = false;
      // const doubles = tc.isDoubles({e: event});
      const element = renderTreeDraw({ info, doubles, data, opponents, options, height, width, title, child });
      const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;

      // if event published add QR code
      if (event?.published && tournamentId) {
        if (event.structure === 'feed') {
          // future TODO... reposition QR code based on feed arm in final round...
        }
        const value = `https://courtHive.com/t/${tournamentId}`;
        images.push(qrFx.getQRuri({ value, qr_dim, x_offset: -1, y_offset: -1 }));
      }

      getLogo().then((logo) => showPDF(logo, images));

      function showPDF(logo, images) {
        SVGasURI(element, images, height).then(showIt, reject).then(cleanUp, cleanUp);

        function showIt(src) {
          const { docDefinition } = drawSheet({
            tournament,
            images: [{ src, pct: 100 }],
            logo,
            selectedEvent,
            event,
            info
          });
          const draw_type = '';
          /*
               if (tc.isElimination({e: event})) draw_type = i18n.t('draws.elimination');
               if (tc.isRoundRobin({e: event})) draw_type = i18n.t('draws.roundrobin');
               if (tc.isCompass({e: event})) draw_type = i18n.t('draws.consolation');
               if (tc.isQualifying({e: event})) draw_type = i18n.t('draws.qualification');
               if (tc.isPlayoff({e: event})) draw_type = i18n.t('pyo');
               */
          const ccat = event.category ? `${event.category}_` : '';

          const filename = download && `${ccat}${event.name}${draw_type ? ' ' + draw_type : ''} Draw Sheet.pdf`;
          exportIt({ docDefinition, filename });
          cleanUp();
        }
      }
    });
  };

  function cleanUp() {
    d3SelectAll('.hidden_render').remove();
  }

  exp.playerList = ({ tournament, players, attributes, doc_name = 'courthive', download }) => {
    getLogo().then(showPDF);
    function showPDF(logo) {
      const { docDefinition } = tournamentPlayerList({
        tournament,
        players,
        attributes,
        logo,
        doc_name,
        rowsPerPage: o.rows_per_page
      });
      const filename = download && `${doc_name}.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.doublesSignInPDF = ({ tournament, teams, event_name, download, doc_name = 'courthive' }) => {
    getLogo().then(showPDF);
    function showPDF(logo) {
      const { docDefinition } = doublesSignInSheet({
        tournament,
        teams,
        event_name,
        logo,
        doc_name,
        rowsPerPage: o.rows_per_page
      });
      const filename = download && `${doc_name}.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  exp.orderedPlayersPDF = ({
    tournament,
    players,
    gender,
    event_name,
    doc_name = 'courthive',
    extra_pages,
    download
  }) => {
    getLogo().then(showPDF);
    function showPDF(logo) {
      const { docDefinition } = signInSheet({
        tournament,
        players,
        gender,
        event_name,
        logo,
        doc_name,
        extra_pages,
        rowsPerPage: o.rows_per_page,
        minimumEmpty: o.minimum_empty
      });
      const filename = download && `${doc_name}.pdf`;
      exportIt({ docDefinition, filename });
    }
  };

  return exp;
})();
