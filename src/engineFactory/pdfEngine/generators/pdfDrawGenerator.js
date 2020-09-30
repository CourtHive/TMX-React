import { qrFx } from 'services/qrFx';
import { selectAll as d3SelectAll } from 'd3';
// import { drawInfo } from 'functions/draws/querying/drawInfo';

import i18n from 'i18next';

import { drawSheet } from 'engineFactory/pdfEngine/draws/drawSheet';
import { SVGasURI } from 'engineFactory/pdfEngine/svgGeneration/svgUtilities';
import { renderTreeDraw } from 'engineFactory/pdfEngine/svgGeneration/renderTreeDraw';

const width = 3000;

function pdfEliminationDraw({ tournament, data, options, selectedEvent, event, download, emit, logo, callback }) {
  return new Promise((resolve, reject) => {
    const doubles = false;
    // const doubles = tc.isDoubles({e: event});
    if (event && event.draw && event.draw.compass) {
      const directions = ['east', 'west', 'north', 'south', 'northeast', 'northwest', 'southeast', 'southwest'];
      const draws = directions.map((direction) => event.draw[direction]).filter((f) => f);
      Promise.all(
        draws.map((data) => {
          // let info = drawInfo(data);
          const info = {};
          const title = data.direction[0].toUpperCase() + data.direction.slice(1);
          return treeDrawURI({ info, doubles, data, options, width, title });
        })
      ).then((srcs) => genDrawSheet(srcs, logo), cleanUp);
    } else {
      // let info = drawInfo(data);
      const info = {};
      if (info && info.draw_type === 'tree') {
        const opponent_count = info && info.draw_positions.length * (doubles ? 2 : 1);
        if (opponent_count <= 64) {
          treeDrawPDF({ tournament, data, options, selectedEvent, info, event, download, emit, callback }).then(
            resolve,
            reject
          );
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
    }

    function genDrawSheet(srcs, logo) {
      const images = srcs.filter((f) => f).map((src) => ({ src, pct: 100 }));
      const { docDefinition } = drawSheet({ tournament, images, logo, selectedEvent });
      cleanUp();
      resolve({ docDefinition });
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
  });
}

function treeDrawPDF({
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
  logo
}) {
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

    SVGasURI(element, images, height).then(success, reject).then(cleanUp, cleanUp);

    function success(src) {
      const { docDefinition } = drawSheet({
        tournament,
        images: [{ src, pct: 100 }],
        logo,
        selectedEvent,
        event,
        info
      });
      resolve({ docDefinition });
    }

    /*
      function showIt(src) {
         const { docDefinition } = drawSheet({ tournament, images: [{src, pct: 100}], logo, selectedEvent, event, info });
         cleanUp();

         let draw_type = '';
         if (tc.isElimination({e: event})) draw_type = i18n.t('draws.elimination');
         if (tc.isRoundRobin({e: event})) draw_type = i18n.t('draws.roundrobin');
         if (tc.isCompass({e: event})) draw_type = i18n.t('draws.consolation');
         if (tc.isQualifying({e: event})) draw_type = i18n.t('draws.qualification');
         if (tc.isPlayoff({e: event})) draw_type = i18n.t('pyo');
         let ccat = event.category ? `${event.category}_` : '';

         let filename = download && `${ccat}${event.name}${draw_type ? ' ' + draw_type : '' } Draw Sheet.pdf`;
         exportIt({ docDefinition, filename });
      }
    */
  });
}

function cleanUp() {
  d3SelectAll('.hidden_render').remove();
}

function treeDrawURI({ info, doubles, data, opponents, options, height, width, title, child, draw_positions }) {
  return new Promise((resolve, reject) => {
    const element = renderTreeDraw({ info, doubles, data, opponents, options, width, title, child, draw_positions });
    SVGasURI(element, [], height).then(resolve, reject);
  });
}

export const pdfDrawGenerator = {
  'elimination draw pdf': pdfEliminationDraw
};

export default pdfDrawGenerator;
