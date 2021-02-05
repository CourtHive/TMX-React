import i18n from 'i18next';

import { reverseStringScore } from 'functions/scoring/reverseStringScore';
import { select as d3Select, event as d3Event, mouse as d3Mouse } from 'd3';
import { line as d3Line } from 'd3';
import { groupGrid } from 'components/drawStructures/roundRobinStructures/roundRobinGrids';
import { keyWalk, bracketDefaultOptions } from './bracketDefaultOptions';

import { fixtures } from 'tods-competition-factory';
const { flagIOC } = fixtures;

const participantFlag = (person) => {
  if (!person) return '';
  const flag = person.nationalityCode ? flagIOC(person.nationalityCode) : '';
  return flag ? `${flag.trim()} ` : '';
};

export function roundRobinBracket() {
  const o = bracketDefaultOptions();

  const datascan = {
    drawPositions: true,
    player_rankings: true,
    player_ratings: false,
    draw_entry: true,
    seeding: true,
    participant: true
  };

  let bracketData;

  let byes = [];
  let participants = [];
  let matchUps = [];
  let participantResults = {};

  const events = {
    score: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    player: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    info: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    bracketOrder: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    result: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    drawPosition: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    sizing: { width: null } // optional functions for sizeToFit
  };

  function chart(opts) {
    // scan data to see if columns necessary

    const opponents = bracketData.participants || [];
    if (opponents && opponents.length) {
      datascan.draw_entry = opponents.reduce((p, c) => c.entry || p, undefined) ? true : false;
      datascan.seeding = opponents.reduce((p, c) => c.seedValue || p, undefined) ? true : false;
      datascan.player_rankings = opponents.reduce((p, c) => c.rank || p, undefined) ? true : false;
      datascan.player_ratings = opponents.reduce((p, c) => c.rating || p, undefined) ? true : false;
      datascan.participant = Boolean(opponents.length);
    }

    const root = d3Select(o.selector || 'body');
    if (o.cleanup) root.selectAll('svg').remove();

    // calculate dimensions
    if (o.sizeToFit || (opts && opts.sizeToFit)) {
      const dims = root.node().getBoundingClientRect();
      o.width =
        events.sizing && events.sizing.width ? events.sizing.width(root) : Math.max(dims.width, o.minWidth || 0);
      o.height = Math.max(dims.height, o.minHeight || 0);
    } else {
      o.width = o.width || Math.max(window.innerWidth, o.minWidth || 0);
      o.height = o.height || Math.max(window.innerHeight, o.minHeight || 0);
    }

    const point_order_differences = Object.keys(participantResults || {}).reduce((p, k) => {
      return participantResults[k].bracketOrder !== participantResults[k].points_order ? true : p;
    }, false);

    let playerHeight = o.height / bracketData.positionsCount + 1;
    if (playerHeight < o.minPlayerHeight) {
      playerHeight = o.minPlayerHeight;
      o.height = bracketData.positionsCount * o.minPlayerHeight;
    }

    const draw_width = o.width - o.margins.left - o.margins.right;
    const draw_height = o.height - o.margins.top - o.margins.bottom;

    const seed_limit = o.seeds.limit || bracketData.seedLimit || opponents.length;

    // supporting functions
    function cellIsBye(cell) {
      return cell.bye;
    }

    const cellFill = (d) => {
      if (d.drawPosition && d.column < 3) {
        if (bracketData.nextUnfilledDrawPositions.includes(d.drawPosition)) {
          return o.cells.unfilled;
        }
      }
      if (d.row && d.attr === 'bracketOrder' && opponents[d.row - 1] && opponents[d.row - 1]) {
        if (opponents[d.row - 1].sub_order === 0) return 'lightyellow';
      }
      if (!d.row && d.column < 3) return 'none';
      if (d.mc !== undefined && +d.row === +d.mc) return o.cells.invalid;

      if (d.attr === 'score' && cellIsBye(d)) return o.cells.bye;
      if (d.row && +d.row !== +d.mc && d.attr === 'score') {
        const sc = cellScore(d);
        if (sc && sc.indexOf('LIVE') >= 0) return o.cells.live;
      }
      if (d.row && d.attr === 'score' && d.bye) return o.cells.bye;
      return 'white';
    };
    const cellStroke = (d) => (d.row || d.column > 2 ? 'gray' : 'none');
    const labelX = (d) => (d.row && d.attr === 'player' ? d.x + 5 : d.x + d.width / 2);
    const labelY = (d) => {
      if (d.row) return d.y + d.height / 2;
      return d.y + d.height / 1.6; // because row 0 is smaller...
    };
    // 0,0 position used for bracket name, if any...
    const textAnchor = (d) => ((d.row && d.attr === 'player') || (!d.row && !d.column) ? 'start' : 'middle');
    const textWeight = (d) => {
      let weight = 'normal';
      if (!d.row && !d.column) weight = 'bold';
      if (d.row && d.attr === 'bracketOrder') weight = 'bold';
      if (d.row && d.attr === 'player' && d.seed && d.seed <= seed_limit) weight = 'bold';
      if (
        d.row &&
        d.attr === 'player' &&
        d.participant &&
        d.participant.seedValue &&
        d.participant.seedValue <= seed_limit
      )
        weight = 'bold';
      if (d.row && d.attr === 'seed') weight = 'bold';
      return weight;
    };
    const textColor = (d) => {
      if (!d.row && !d.column) return 'blue';
      if (d.row && d.attr === 'seed') {
        return o.seeds.color;
      }
      if (d.row && d.attr === 'player' && d.participant && d.participant.seedValue) {
        return o.seeds.color;
      }
      if (d.row && d.attr === 'score' && d.row !== d.mc) {
        const sc = cellScore(d);
        const num = sc ? sc.match(/\d+/g) : undefined;
        if (sc && !num) {
          if (d.matchUp && d.matchUp.winningSide !== undefined) {
            const winnerIndex = d.matchUp.winningSide - 1;
            const loserIndex = 1 - winnerIndex;
            const losingSide = d.matchUp.sides[loserIndex];
            console.log('score adornment', { losingSide });
          }
          // indicate w.o. for losing row by changing text to red
          // return loser && loser[0] && loser[0].drawPosition === d.row ? 'red' : 'black';
        }
      }
      return 'black';
    };
    const cellText = (d) => {
      const participantId = d.participant && d.participant.participantId;
      const participantResult = participantResults && participantResults[participantId];

      if (d.row && d.attr === 'score' && d.row !== d.mc) {
        const score = cellScore(d);
        const num = score ? score.match(/\d+/g) : undefined;
        if (score && !num && d.matchUp.winningSide) {
          console.log('score adornment');
          /*
               // indicate w.o. for losing row by adding - and for winning row by adding +
               score += ` (${indicator})`;
               */
        }
        return score;
      }

      if (!d.row && !d.column && d.group_name) {
        return d.group_name;
      }
      if (!d.row && d.attr === 'bracketOrder') {
        return `#${point_order_differences ? ':p' : ''}`;
      }
      if (!d.row && d.attr === 'result') return i18n.t('scoring.winloss_abbreviation') || '+/-';
      if (!d.row && d.attr === 'games') return 'g+/g-';
      if ((+d.row === 0 && d.column < 6) || (d.mc !== undefined && +d.row === +d.mc)) return '';
      if (d.row && d.attr === 'player' && d.bye) return 'BYE';

      // fill in last name for matchUp column headers
      if (!d.row && d.attr === 'player') {
        return participantColumnHeader(d);
      }
      if (d.row && d.attr === 'player') {
        const person = d.participant && d.participant.person;
        const flag = person && participantFlag(person);
        const name = d.participant ? d.participant.name || '' : '';
        return name && flag ? `${flag}${name}` : name || '';
      }

      if (d.row && d.attr === 'seed' && opponents[d.row - 1] && opponents[d.row - 1].seedValue) {
        const rank = opponents[d.row - 1].rank;
        const seed = opponents[d.row - 1].seedValue;
        if (!rank || !seed) return ''; // don't display seed position for unranked participants
        return seed <= seed_limit ? seed : '';
      }

      if (d.row && d.attr === 'drawPosition') {
        const draw_order = d.row + bracketData.positionsCount * d.bracket;
        return draw_order;
      }

      if (d.row && participantResult && participantResult[d.attr]) {
        if (d.attr === 'bracketOrder' && participantResult.bracketOrder) {
          let order = participantResult.bracketOrder;
          if (participantResult.sub_order) order += `-${participantResult.sub_order}`;
          if (participantResult.points_order && point_order_differences) order += `:${participantResult.points_order}`;
          if (participantResult.assigned_order) return participantResult.assigned_order;
          return order;
        }
        if (d.attr === 'result' && participantResult.result) {
          return participantResult.result || '0/0';
        }
        if (d.attr === 'games' && participantResult.games) {
          return participantResult.games || '0/0';
        }
        return participantResult[d.attr];
      }

      if (d.row && d.participant) {
        /*
            if (d.attr === 'participant' && participant.name) {
               let doubles = participant && participant.IndividualParticipants;
               if (doubles) return '';
               if (participant.person && participant.person.nationalityCode) return participant.person.nationalityCode;
            }
            */
        if (d.attr === 'rank') {
          const doubles = d.participant && d.participant.IndividualParticipants;
          if (doubles) return '';
          let ranking_rating;
          if (o.details.player_ratings && datascan.player_ratings) {
            // ranking_rating = participant.rating;
          } else {
            // ranking_rating = team[0].rank && !isNaN(team[0].rank) ? parseInt(team[0].rank.toString().slice(-4)) : '';
            // if (ranking_rating && team[0].int && team[0].int > 0) ranking_rating = `{${team[0].int}}`;
          }
          return ranking_rating;
        }
      }
      return '';
    };

    // cellClass generates a unique selector
    const cellClass = (d) => {
      const column = d.column > 2 ? `_${d.column - 2}` : '';
      const base_class = `rr${bracketData.bracketIndex !== undefined ? bracketData.bracketIndex : ''}_${d.attr}`;
      const specific_class = `${base_class}_${d.row}${column}`;

      const sc = d.row && +d.row !== +d.mc && cellScore(d);
      const live_score = sc && sc.indexOf('LIVE') >= 0;
      const score_class = live_score ? 'LIVE' : '';

      // don't return additional clases for player cells when row < 1
      if (d.attr === 'player' && !d.row) return 'cell';

      if (d.attr === 'score' && cellIsBye(d)) return 'cell bye_cell';

      // don't return additional classes for score cells when same player
      return d.attr === 'score' && +d.row === +d.column - 2
        ? 'cell'
        : `cell rr_${d.attr} ${base_class} ${specific_class} ${score_class}`;
    };

    const handleContextClick = (d) => {
      d3Event.preventDefault();
      const isValidFunction = events[d.attr] && typeof events[d.attr].contextmenu === 'function';
      return isValidFunction ? invoke(d, `${d.attr}.contextmenu`) : undefined;
    };

    const clickEvent = (d) => {
      const isValidFunction = events[d.attr] && typeof events[d.attr].click === 'function';
      return isValidFunction ? invoke(d, `${d.attr}.click`) : undefined;
    };
    const mouseOver = (d) =>
      events[d.attr] && typeof events[d.attr].mouseover === 'function' ? events[d.attr].mouseover(d) : undefined;
    const mouseOut = (d) =>
      events[d.attr] && typeof events[d.attr].mouseout === 'function' ? events[d.attr].mouseout(d) : undefined;

    // construct round robin bracket
    const grid = groupGrid({ o, width: draw_width, height: draw_height, matchUps, participants, byes, bracketData });
    const labels = groupGrid({
      textGrid: true,
      o,
      width: draw_width,
      height: draw_height,
      matchUps,
      participants,
      byes,
      bracketData
    });

    const tmxLine = d3Line()
      .x((d) => d.x)
      .y((d) => d.y);
    const columnsCount = grid[0].length;
    const firstRowCell = grid[1][0];
    const finalRowCell = grid[1][columnsCount - 1];

    const lineData = [
      {
        path: [
          {
            x: firstRowCell.x,
            y: firstRowCell.y
          },
          {
            x: finalRowCell.x + finalRowCell.width,
            y: firstRowCell.y
          }
        ]
      }
    ];

    const svg = root
      .append('svg')
      .attr('width', draw_width + o.margins.left + o.margins.right)
      .attr('height', draw_height + o.margins.top + o.margins.bottom)
      .append('g')
      .attr('transform', 'translate(' + +o.margins.left + ',' + o.margins.top + ')');

    const cellrows = svg.selectAll('.cellrow').data(grid).enter().append('g').attr('class', 'cellrow');

    cellrows
      .selectAll('.cell')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('class', cellClass)
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d) => d.height)

      .attr('attr', (d) => d.attr)
      .attr('row', (d) => d.row)
      .attr('column', (d) => d.column)

      .attr('opacity', 1)
      .style('fill', cellFill)
      .style('stroke', cellStroke)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)
      .on('click', clickEvent)
      .on('contextmenu', handleContextClick);

    const textrows = svg.selectAll('.textrow').data(labels).enter().append('g').attr('class', 'textrow');

    textrows
      .selectAll('.rr_label')
      .data((d) => d)
      .enter()
      .append('text')
      .attr('class', 'rr_label')
      .attr('text-anchor', textAnchor)
      .attr('font-weight', textWeight)
      .attr('alignment-baseline', 'middle')
      .attr('x', labelX)
      .attr('y', labelY)
      .text(cellText)
      .style('font-size', textSize)
      .style('fill', textColor)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)
      .on('click', clickEvent)
      .on('contextmenu', handleContextClick);

    function textSize(d) {
      const group_name = !d.row && !d.column;
      const width_multiplier = 13;
      const ctl = this.getComputedTextLength();
      let size = Math.round((d.width * width_multiplier) / ctl);
      if (size > o.names.max_font_size) size = o.names.max_font_size;
      if (size < o.names.min_font_size) size = o.names.min_font_size;
      if (group_name) size = o.names.max_font_size;
      return size + 'px';
    }

    svg
      .selectAll('.emphasisLine')
      .data(lineData)
      .enter()
      .append('path')
      .attr('d', (d) => tmxLine(d.path))
      .attr('class', 'emphasisLine')
      .attr('stroke-width', 3)
      .attr('stroke', 'black')
      .style('shape-rendering', 'crispEdges');
  }

  chart.reset = function () {
    byes = [];
    participants = [];
    matchUps = [];
    return chart;
  };

  chart.selector = function (value) {
    if (!arguments.length) {
      return o.selector;
    }
    o.selector = value;
    return chart;
  };

  chart.bracketData = (bracket) => {
    bracketData = bracket;
    if (bracket.name) o.bracket_name = bracket.name;
    if (bracket.participants) chart.addParticipants(bracket.participants);
    if (bracket.matchUps) matchUps = bracket.matchUps;
    if (Array.isArray(bracket.byes)) {
      byes = [];
      bracket.byes.forEach((b) => {
        if (b.drawPosition) {
          byes[b.drawPosition - bracketData.initialBracketPosition + 1] = true;
        }
      });
    }
    if (bracket.participantResults) participantResults = bracket.participantResults;
    return chart;
  };

  chart.bracketName = function (value) {
    if (!arguments.length) {
      return o.bracket_name;
    }
    o.bracket_name = value;
    return chart;
  };

  chart.width = function (value) {
    if (!arguments.length) {
      return o.width;
    }
    o.width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) {
      return o.height;
    }
    o.height = value;
    return chart;
  };

  chart.sizeToFit = function (value) {
    if (!arguments.length) {
      return o.sizeToFit;
    }
    o.sizeToFit = value;
    return chart;
  };

  chart.options = function (values) {
    if (!arguments.length) return o;
    keyWalk(values, o);
    return chart;
  };

  chart.seedLimit = function (seed_limit) {
    if (!arguments.length) return o.seeds.limit;
    o.seeds.limit = seed_limit;
    return chart;
  };

  chart.participantResults = function (results) {
    participantResults = results;
    return chart;
  };

  chart.addParticipants = function (newParticipants) {
    if (!newParticipants) return participants;
    if (!Array.isArray(newParticipants)) return chart;
    participants = [];
    newParticipants.forEach((participant) => addParticipant(participant));
    return chart;

    function addParticipant(participant) {
      if (typeof participant !== 'object' || !participant.drawPosition) {
        return;
      }
      if (participant.drawPosition < bracketData.initialBracketPosition) {
        return;
      }
      if (participant.drawPosition > bracketData.initialBracketPosition + bracketData.positionsCount - 1) {
        return;
      }
      const index = participant.drawPosition - bracketData.initialBracketPosition;
      participants[index] = participant;
    }
  };

  chart.events = function (obj) {
    if (!arguments.length) return events;
    keyWalk(obj, events);
    return chart;
  };

  function cellScore(d) {
    let score;
    const matchUpId = d.matchUp && d.matchUp.matchUpId;
    const matchUp = matchUps.reduce((matchUp, candidate) => {
      return matchUpId && candidate.matchUpId === matchUpId ? candidate : matchUp;
    }, undefined);
    if (matchUp && matchUp.score) {
      const winningSide = matchUp.winningSide;
      if (winningSide) {
        const winnerParticipantId = matchUp.sides[winningSide - 1].participantId;
        const winnerPosition = participants.reduce((position, participant, i) => {
          return participant.participantId === winnerParticipantId ? i + 1 : position;
        }, undefined);
        if (typeof matchUp.score === 'object') {
          score = d.row === winnerParticipantId ? matchUp.score.scoreStringSide1 : matchUp.score.scoreStringSide2;
        } else {
          score = d.row === winnerPosition ? matchUp.score : reverseStringScore(matchUp.score);
        }
      }
    }
    return score;
  }

  function participantColumnHeader(d) {
    if (d.bye) return 'BYE';
    if (!d.participant.person) {
      return d.participant.name;
    }
    const header = (d.participant.person && d.participant.person.standardFamilyName) || '';
    return header;
  }

  return chart;

  function getCoords() {
    const evt = d3Event;
    const selector = document.querySelector(o.selector);
    const mouse = selector ? d3Mouse(selector) : [0, 0];
    return { selector_x: mouse[0], selector_y: mouse[1], screen_x: evt.clientX, screen_y: evt.clientY };
  }

  function invoke(d, eventRef, index) {
    const coords = getCoords();
    const children = eventRef.split('.');
    let obj = events;
    while (children.length) {
      const child = children.shift();
      obj = (obj && obj[child]) || '';
    }
    if (obj && typeof obj === 'function') {
      obj(d, coords, index);
    }
  }
}

export default roundRobinBracket;
