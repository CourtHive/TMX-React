// import { rrDraw } from 'components/drawDisplay/rrDraw';
/*
import { select as d3Select, selectAll as d3SelectAll } from 'd3';

import { qrFx } from 'services/qrFx';
import { SVGasURI } from 'engines/pdfEngine/svgGeneration/svgUtilities';

import { drawSheet } from 'engines/pdfEngine/draws/drawSheet';
import { getLogo } from 'engines/pdfEngine/imageHandlers/getImage';

function cleanUp() { d3SelectAll('.hidden_render').remove(); }
*/
export function renderRoundRobinDraw({ tournament, data, options, selectedEvent, info, event }) {
  return new Promise((resolve, reject) => {
    /*
     cleanUp();

     let render_id = `rr_hidden_render`;

     d3Select('body')
        .append('div')
           .attr('class', 'hidden_render')
        .append('div')
           .attr('id', render_id)
           .attr('class', 'offscreen');

     // TODO: set width and height here... and make font_size and other
     // calculations based on the width and height... because width and
     // height determine the size of the PNG generated from the SVG and
     // therefore the size of the PDF and the amount of time it takes to
     // process ...

     let element = document.getElementById(render_id);

     // create an off-screen draw so that sizing is uninhibited by screen real-estate
     let draw = rrDraw();
     draw.data(data);
     draw.options(options);
     draw.options({
        sizeToFit: false,
        min_width: 3000,
        width: 3000,
        min_height: 600,
        minPlayerHeight: 60,
        id: `rr_offscreen`
     });

     draw.options({names: { length_divisor: 23 }});
     draw.options({names:  { max_font_size: 40, min_font_size: 40 }});
     draw.options({scores: { max_font_size: 40, min_font_size: 40 }});

     draw.selector(element)();

     getLogo().then(showPDF);

     function showPDF(logo) {
        let bracket_svgs = Array.from(element.querySelectorAll('svg'));
        Promise.all(bracket_svgs.map(element => SVGasURI(element)))
           .then(showIt, reject)
           .then(cleanUp, cleanUp);
           
        function showIt(uris) {
           let images = uris.map(src => ({ src, pct: 100 }));
           const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;
           if (event && event.published && tournament && tournamentId) {
              let message = `https://courtHive.com/t/${tournamentId}`;
              var qruri = qrFx.getQRuri({ message, qr_dim: 500 });
              images.push({ src: qruri.src, pct: 20 });
           }
           let { docDefinition } = drawSheet({ tournament, images, logo, selectedEvent, event, info });
           resolve({docDefinition});
        }
     }
     */
  });
}
