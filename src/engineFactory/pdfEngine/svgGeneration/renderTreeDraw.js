// import { treeDraw } from 'components/drawDisplay/treeDraw';
import { select as d3Select, selectAll as d3SelectAll } from 'd3';

function cleanUp() { d3SelectAll('.hidden_render').remove(); }
export function renderTreeDraw({ info, doubles, data, opponents, options, width, title, child, draw_positions }) {
  cleanUp();

  let render_id = `td_hidden_render`;

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

  /*
  let element = document.getElementById(render_id);

  // create an off-screen draw so that sizing is uninhibited by screen real-estate
  let draw = treeDraw();
  draw.options(options);
  draw.width(width);

  draw.options({edit_fields: { display: false }, flags: { display: false }});
  if (info && info.draw_positions.length > 8) draw.options({invert_first: true});

  draw.options({players: { offset_left: 8, offset_singles: -10, offset_doubles: -60, offset_score: 10 }});
  draw.options({names:  { max_font_size: 40, min_font_size: 40 }});
  draw.options({scores: { max_font_size: 40, min_font_size: 40 }});

  let opponent_count = draw_positions || (info && info.draw_positions.length * (doubles ? 2 : 1));
  if (child !== undefined) opponent_count = opponent_count / 2;

  // accomodate title for compass draws
  if (title) { draw.options({ text: {title}, margins: { top: 160 } }); }

  // minPlayerHeight and maxPlayerHeight must be set the same to force
  // fixed size when generating PDFs... for situations where Draw Structure
  // is broken into a number of sub-draws

  if (opponent_count <= 4) {
     draw.options({
        names: { length_divisor: 23, max_font_size: 50, min_font_size: 50 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 80, width: 65, first_round: 110 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 180,
        maxPlayerHeight: 180,
        detail_attr: { font_size: 40, seeding_font_size: 54 }
     });
  } else if (opponent_count <= 8) {
     draw.options({
        names: { length_divisor: 23, max_font_size: 50, min_font_size: 50 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 80, width: 65, first_round: 110 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 170,
        maxPlayerHeight: 170,
        detail_attr: { font_size: 40, seeding_font_size: 54 }
     });
  } else if (opponent_count <= 16) {
     draw.options({
        names: { length_divisor: 23, max_font_size: 50, min_font_size: 50 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 80, width: 65, first_round: 110 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 150,
        maxPlayerHeight: 150,
        detail_attr: { font_size: 40, seeding_font_size: 54 }
     });
  } else if (opponent_count <= 24) {
     draw.options({
        names: { length_divisor: 23 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 80, width: 65, first_round: 110 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 130,
        maxPlayerHeight: 130,
        detail_attr: { font_size: 36, seeding_font_size: 54 }
     });
  } else if (opponent_count <= 32) {
     draw.options({
        names: { length_divisor: 23 },
        teams: { threshold: 500 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 80, width: 55, first_round: 110 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 100,
        maxPlayerHeight: 100,
        detail_attr: { font_size: 30, seeding_font_size: 45 }
     });
  } else if (opponent_count <= 48) {
     draw.options({
        names: { length_divisor: 23 },
        teams: { threshold: 500 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 70, width: 55, first_round: 105 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 65,
        maxPlayerHeight: 65,
        detail_attr: { font_size: 30, seeding_font_size: 45 }
     });
  } else if (opponent_count >= 64) {
     draw.options({
        margins: { top: 40 },
        names: { length_divisor: 23 },
        teams: { threshold: 500 },
        umpires: { offset: 45 },
        matchdates: { offset: -45 },
        detail_offsets: { base: 60, width: 55, first_round: 105 },
        lines: { stroke_width: 4 },
        minPlayerHeight: 51,
        maxPlayerHeight: 51,
        detail_attr: { font_size: 30, seeding_font_size: 45 }
     });
  }

  // add data
  if (child !== undefined) {
     draw.data({draw: data.children[child], opponents: data.opponents || opponents});
  } else {
     draw.data({draw: data, opponents: data.opponents || opponents});
  }

  // render the svg
  draw.selector(element)();
  return element;
  */
}
