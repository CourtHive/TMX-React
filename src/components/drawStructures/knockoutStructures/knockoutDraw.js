import { hierarchy, cluster } from 'd3';
import { line as d3Line, tree as d3Tree } from 'd3';
import { select as d3Select, event as d3Event, mouse as d3Mouse } from 'd3';

import ParticipantData from './participantData';
import { generateRange } from 'functions/arrays';
import { keyWalk, knockoutDefaultOptions } from './knockoutDefaultOptions';
import { dateDetail, matchDetail, scoreDetail, statusDetail } from './matchUpData';
import { feedAnalysis, hasDoubles, hasTeams, hasNationalities, scanData } from './drawAnalysis';

// import { drawEngine } from 'competitionFactory';
import { drawEngine } from 'tods-competition-factory';

export function knockoutDraw() {
  const o = knockoutDefaultOptions();
  const P = new ParticipantData({ options: o });

  let root;
  const info = { dataScan: { drawPositions: true } };
  const data = {};

  const events = {
    position: { click: null, contextmenu: null },
    person: { click: null, contextmenu: null },
    compass: { mouseover: null, mouseout: null, click: null, contextmenu: null },
    score: { mouseover: null, mouseout: null, click: null, contextmenu: null },
    umpire: { mouseover: null, mouseout: null, click: null, contextmenu: null },
    matchdate: { mouseover: null, mouseout: null, click: null, contextmenu: null },
    sizing: { width: null } // optional functions for sizeToFit
  };

  function chart(opts) {
    root = d3Select(o.selector || 'body');

    if (!data || !Object.keys(data).length) {
      if (o.cleanup) root.selectAll('svg').remove();
      return;
    }

    let team_width = 0;
    let minHeight = o.minHeight;

    if (info.firstRoundPositionsCount) {
      // team_width = opponents.reduce((p, c) => c[0].team && c[0].team.length > p ? c[0].team.length : p, 0);
      if (team_width > 15) team_width = 15;
      minHeight = Math.max(minHeight, info.firstRoundPositionsCount * o.minPlayerHeight);
    }
    // left column offset must calculate all of the details that are left of player names
    const detail_keys = ['drawPositions', 'drawEntry', 'playerRankings', 'playerRatings'];
    if (!o.names.seed_block) detail_keys.push('seeding');
    const filtered_keys = detail_keys.filter((f) => o.details[f] && info.dataScan[f]);

    let left_column_offset = filtered_keys.length * o.detail_offsets.width || 0;
    if (left_column_offset) left_column_offset += o.detail_offsets.base;
    left_column_offset += o.detail_offsets.first_round;

    // let seeding = !o.names.seed_block && o.details.seeding && info.dataScan.seeding ? o.detail_offsets.width : 0;
    const seeding = !o.names.seed_block && o.details.seeding ? o.detail_offsets.width : 0;
    let team = o.details.teams && info.hasTeams ? team_width * 2 : 0;

    // letf colunn offset also takes into consideration any additional info on player line
    let additional_width = team;
    left_column_offset += additional_width;

    if (o.sizeToFit || (opts && opts.sizeToFit)) {
      const dims = root.node().getBoundingClientRect();
      o.width = events.sizing.width ? events.sizing.width(root) : Math.max(dims.width, o.minWidth || 0);
      o.height = Math.max(dims.height, minHeight || 0);
    } else {
      o.width = o.width || Math.max(window.innerWidth, o.minWidth || 0);
      o.height = o.height || Math.max(window.innerHeight, minHeight || 0);
    }

    const draw_hierarchy = hierarchy(data.hierarchy);
    // TODO: find a different way to collapse...
    // drawEngine.collapseHierarchy(draw_hierarchy, info.maxRound);

    let playerHeight = o.height / info.firstRoundPositionsCount;

    const fedFirstMultiplier = info.feedRounds.includes(1) ? 3 : 1;
    const baseMultiplier = fedFirstMultiplier * (info.hasDoubles ? 2 : 1);
    const zoomMultiplier = info.zoom ? 2 : 1;
    const minPlayerHeightMultiplier = zoomMultiplier * baseMultiplier;
    const minPlayerHeight = minPlayerHeightMultiplier * o.minPlayerHeight;
    const maxPlayerHeight = minPlayerHeightMultiplier * o.maxPlayerHeight;
    if (playerHeight < minPlayerHeight) {
      o.height = info.firstRoundPositionsCount * minPlayerHeight;
      playerHeight = minPlayerHeight;
    } else if (playerHeight > maxPlayerHeight) {
      o.height = info.firstRoundPositionsCount * maxPlayerHeight;
      playerHeight = maxPlayerHeight;
    }

    if (info.feedIn) {
      o.margins.top = (info.hasDoubles ? 2 : 1) * o.minPlayerHeight;
      o.margins.bottom = (info.hasDoubles ? 2 : 1) * o.minPlayerHeight;
    }

    let draw_width;
    let roundWidth;
    let invert_first;

    const calcRoundWidth = () => {
      draw_width = o.width - o.margins.left - o.margins.right - left_column_offset;
      roundWidth = draw_width / (info.maxRound + 1);
      invert_first =
        info.maxRound > 1 && !info.feedIn && (o.invert_first || roundWidth < o.invert_threshold) ? true : false;
      if (invert_first) roundWidth = draw_width / info.maxRound;
    };

    calcRoundWidth();
    if (roundWidth + o.detail_offsets.first_round < o.teams.threshold) {
      left_column_offset -= additional_width;
      team = 0;
      additional_width = 0;
      calcRoundWidth();
    }

    P.roundWidth = roundWidth;

    // make sure there is enough space for inverting
    if (info.firstRoundPositionsCount < 8) {
      o.height = 8 * minPlayerHeight;
    }

    const top_margin = Math.max(
      o.margins.top,
      info.hasDoubles ? Math.abs(o.players.offset_doubles) : Math.abs(o.players.offset_singles)
    );
    const draw_height = o.height - top_margin - o.margins.bottom;

    const lengthThreshold = roundWidth / o.names.length_divisor;

    const tree = info.feedIn ? d3Tree() : cluster();

    tree
      .separation((a, b) => (a.parent === b.parent ? 1 : 1))
      .size([draw_height, draw_width - (invert_first ? 0 : roundWidth)]);

    const nodes = tree(draw_hierarchy).descendants();
    /* reverse so that final on the right hand side */
    nodes.forEach((n) => (n.y = draw_width + roundWidth - n.y));
    if (o.roundBar.display) {
      nodes.forEach((n) => (n.x = n.x + o.roundBar.offset));
    }

    const links = nodes[0].links();
    const filteredLinks = links.filter((link) => link.target.height < info.limitRound);

    // keep track of any overflow due to feed rounds
    const maxHeight = filteredLinks.reduce((max, link) => (link.target.x > max ? link.target.x : max), draw_height);

    const roundOffsets = Object.assign(
      {},
      ...filteredLinks.map((l) => ({ [l.source.data.roundNumber]: Math.abs(l.source.x - l.target.x) }))
    );
    if (roundOffsets[1] && roundOffsets[2] && roundOffsets[1].toFixed(2) === roundOffsets[2].toFixed(2)) {
      roundOffsets[1] = roundOffsets[2] / 8;
    }

    // for each height adjust all source nodes by apprpriate offset
    // if link is a feed node then also adjust the target node
    filteredLinks.forEach((l) => {
      let sourceChange, targetChange;
      const roundNumber = l.source.data.roundNumber;
      const feedRoundNumber = l.target.data.feedRoundNumber;
      const fedCount = info.fedCount.slice(0, roundNumber).reduce((a, b) => a + b);
      const pastFeed = info.fedCount[roundNumber];
      const offset = roundOffsets[roundNumber - 1] || 0;
      const odd = fedCount % 2;

      if (feedRoundNumber) {
        if (odd) {
          sourceChange = (-1 * offset) / 2;
          targetChange = -1 * offset;
        } else {
          sourceChange = offset;
          targetChange = offset * 2;
        }
        if (feedRoundNumber === 2 && roundNumber === 4 && fedFirstMultiplier) {
          targetChange += offset;
        }
        l.source.x += sourceChange;
        l.target.x += targetChange;
      } else if (pastFeed) {
        const multiplier = odd ? -1 : 1;
        l.target.x += (multiplier * offset) / 4;
      }
    });

    if (invert_first) links[0].source.y = links[0].source.y - 2 * roundWidth;

    const elbow = (d) => {
      let target_y = d.target.y;
      const ydiff = d.source.y - d.target.y;

      const feedOffset = d.target.data.feedRoundNumber ? seeding * 1.5 : 0;
      let ho = (feedOffset || seeding) + (ydiff - roundWidth > 1 ? roundWidth * 2 : roundWidth);

      if (ydiff - roundWidth > 1) target_y += roundWidth;

      // insure that lines for compressed draw formats extend full left
      const matchNode = d.target.matchUpId;
      if (+d.target.depth === +info.maxRound || (!info.feedIn && d.target.depth < info.maxRound && !matchNode)) {
        ho = ho + left_column_offset - seeding;
      }

      return `M${d.source.y},${d.source.x}H${target_y}V${d.target.x}${d.target.children ? '' : 'h-' + ho}`;
    };

    // temporarily used for figuring out feed-in draw layout
    const pathColor = (d) => {
      let color = 'black';
      if (d.target.data.feedRoundNumber) color = 'blue';
      return color;
    };

    if (o.cleanup) root.selectAll('svg').remove();

    const svg_width = draw_width + o.margins.left + o.margins.right + left_column_offset;
    const translate_x = left_column_offset + +o.margins.left - (invert_first ? 0 : roundWidth);
    const svg_root = root
      .append('svg')
      .style('shape-rendering', 'crispEdges')
      .attr('width', svg_width)
      .attr('height', maxHeight + top_margin + o.margins.bottom);

    const svg = svg_root.append('g').attr('transform', 'translate(' + translate_x + ',' + top_margin + ')');

    svg
      .selectAll('.tdElbow')
      .data(filteredLinks)
      .enter()
      .append('path')
      .attr('class', 'tdElbow')
      .attr('opacity', drawVisibility)
      .style('fill', 'none')
      .style('stroke', pathColor)
      .style('stroke-width', o.lines.stroke_width + 'px')
      .style('shape-rendering', 'geometricPrecision')
      .attr('d', elbow);

    // use this to add round name lines
    const tmxLine = d3Line()
      .x((d) => d.x)
      .y((d) => d.y);
    if (o.roundBar.display) {
      const notInvertedAdustment = roundWidth - seeding - additional_width + 20;
      const adjustment = !invert_first ? notInvertedAdustment : 0;
      const roundsCount = info.maxRound;
      const roundBarY = o.roundBar.offset / 2;
      const roundLineStart = (roundNumber) => {
        return roundNumber === 1 ? 0 - left_column_offset : roundWidth * (roundNumber - 1) + 10;
      };
      const roundsData = generateRange(1, roundsCount + 1).map((roundNumber) => {
        return {
          roundName: `ROUND ${roundNumber}`,
          p: [
            {
              x: roundLineStart(roundNumber) + adjustment,
              y: roundBarY
            },
            {
              x: roundWidth * roundNumber + adjustment,
              y: roundBarY
            }
          ],
          t: {
            x: roundLineStart(roundNumber) + 5 + adjustment,
            y: roundBarY - 7
          },
          w: o.roundBar.stroke,
          c: 'black'
        };
      });

      svg
        .selectAll('.roundLine')
        .data(roundsData)
        .enter()
        .append('path')
        .attr('d', (d) => tmxLine(d.p))
        .attr('class', 'roundLine')
        .attr('stroke-width', (d) => d.w)
        .attr('stroke', (d) => d.c)
        .style('shape-rendering', 'crispEdges');

      svg
        .selectAll('.roundHeader')
        .data(roundsData)
        .enter()
        .append('text')
        .attr('text-anchor', 'left')
        .attr('class', 'roundHeader')
        .attr('x', (d) => d.t.x)
        .attr('y', (d) => d.t.y)
        .html((d) => d.roundName)
        .style('fill', '#808080')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.roundBar.fontSize + 'px');
    }

    /*
      // this was used for old vertical lines separating seeding
      // function lineX(x) { return invert_first ? x - seeding - additional_width - o.detail_offsets.first_round : x - o.detail_offsets.first_round; }

      if (left_column_offset) {
         let lines = [ {p: [{x: lineX(0), y: lineY(0)}, {x: lineX(0), y: lineY(draw_height)}], w: o.lines.stroke_width, c: 'black' } ];
         if (seeding) {
            let line = {
               p: [{x: lineX(seeding), y: lineY(0)}, {x: lineX(seeding), y: lineY(draw_height)}], 
               w: o.lines.stroke_width, c: 'black'
            };
            lines.push(line);
         }
         svg.selectAll('.line')
            .data(lines).enter().append('path')
            .attr('d', d => tmxLine(d.p))
            .attr('stroke-width', d => d.w)
            .attr('stroke', d => d.c)
            .style("shape-rendering", "crispEdges");
      }
      */

    if (o.text.title) {
      svg_root
        .append('g')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', svg_width / 2)
        .attr('y', o.detail_attr.seeding_font_size * 2)
        .html(o.text.title)
        .style('fill', '#000')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.detail_attr.seeding_font_size * 1.5 + 'px');
    }

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('matchUpId', (d) => d.data.matchUpId)
      .attr('draw_position', (d) => d.data.drawPosition)
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    if (o.matchdates.display) {
      node
        .append('text')
        .attr('x', playerBaseX)
        .attr('y', o.matchdates.offset)
        .attr('class', 'modalPositionOptions')
        .attr('modalPosition', 'dateDetail')
        .attr('text-anchor', 'start')
        .attr('dy', '.71em')
        .text((d) => dateDetail(d, o))
        .style('fill', o.matchdates.color)
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', scoreSize)
        .style('font-style', 'italic')
        .on('click', (d) => invoke(d, 'matchdate.click'))
        .on('mouseover', events.matchdate.mouseover)
        .on('mouseout', events.matchdate.mouseout)
        .on('contextmenu', (d) => invoke(d, 'matchdate.contextmenu'));
    }

    const visibleEditFieldHeight = (o.minPlayerHeight / 2) * (info.hasDoubles ? 2 : 1);
    if (o.edit_fields.display) {
      node
        .append('rect')
        .attr('class', (d) => `editField ${d.data.readyToScore && 'readyToScore'}`)
        .attr('modalPosition', 'editField')
        .attr('id', (d) => P.hashCode(d) || d.data.matchUpId)
        .attr('x', playerBaseX)
        .attr('y', -1 * visibleEditFieldHeight)
        .attr('width', editWidth)
        .attr('height', visibleEditFieldHeight)
        .attr('opacity', (d) => P.editVisible(d))
        .attr('scoreState', (d) => P.scoreState(d))
        .attr('fill', o.edit_fields.color)
        .attr('hid', (d) => P.hashCode(d))
        .on('click', (d) => invoke(d, 'position.click'))
        .on('mouseover', (d, i) => P.highlightCell(d, i, root))
        .on('mouseout', (d, i) => P.unHighlightCell(d, i, root))
        .on('contextmenu', (d) => invoke(d, 'position.contextmenu'));

      node
        .append('rect')
        .attr('class', 'editField')
        .attr('modalPosition', 'editField')
        .attr('id', (d) => P.hashCode(d) || d.data.matchUpId)
        .attr('x', playerBaseX)
        .attr('y', o.players.offset_score)
        .attr('width', editWidth)
        .attr('height', editFieldHeight)
        .attr('opacity', 0)
        .on('click', (d) => invoke(d, 'score.click'))
        .on('contextmenu', (d) => invoke(d, 'score.contextmenu'));
    }

    // edit field should be height zero for first round so there is no overlap with fields for placing players in the draw
    // function editFieldHeight(d) { return (!d.height) ? 0 : playerHeight/(doubles ? 1.5 : 1.5); }
    function editFieldHeight(d) {
      return !d.height ? 0 : playerHeight / (zoomMultiplier * 1.5);
    }

    function editWidth(d) {
      let width = roundWidth - o.players.offset_left;
      const feed = d.data && d.data.feed;
      if (!d.height && !feed) {
        width += additional_width + o.detail_offsets.first_round;
      }
      return width > 0 ? width : 0;
    }

    if (o.details.drawPositions) {
      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', dpX)
        .attr('y', o.players.offset_singles)
        .html((d) => P.drawPosition(d))
        .style('fill', '#000')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.detail_attr.font_size + 'px');
    }

    if (
      (o.details.playerRankings && info.dataScan.playerRankings) ||
      (o.details.playerRatings && info.dataScan.playerRatings)
    ) {
      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', prX)
        .attr('y', o.players.offset_singles)
        .html((d) => P.rankingRating(d, 0))
        .style('fill', '#000')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.detail_attr.font_size + 'px');

      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', prX)
        .attr('y', o.players.offset_singles + o.players.offset_doubles)
        .html((d) => P.rankingRating(d, 0))
        .style('fill', '#000')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.detail_attr.font_size + 'px');
    }

    if (o.details.drawEntry && info.dataScan.drawEntry) {
      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', deX)
        .attr('y', o.players.offset_singles)
        .html((d) => P.drawEntry(d))
        .style('fill', '#000')
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', o.detail_attr.font_size + 'px');
    }

    node
      .append('text')
      .attr('class', 'tdOpponentName')
      .attr('text-anchor', 'start')
      .attr('x', textX)
      .attr('y', o.players.offset_singles)
      .attr('class', 'modalPositionOptions')
      .attr('modalPosition', 'opponentName teamPosition_0')
      .attr('positionIndex', '0')
      .html((d) => P.name(d, 0, lengthThreshold))
      .style('font-weight', (d) => P.playerBold(d))
      .style('fill', (d) => P.playerColor(d))
      .style('shape-rendering', 'geometricPrecision')
      .style('font-size', nameSize)
      .on('click', (d) => invoke(d, 'person.click', 0))
      .on('mouseover', (d, i) => P.highlightCell(d, i, root))
      .on('mouseout', (d, i) => P.unHighlightCell(d, i, root))
      .on('contextmenu', (d) => invoke(d, 'person.contextmenu', 0));

    node
      .append('text')
      .attr('class', 'dbls')
      .attr('text-anchor', 'start')
      .attr('x', textX)
      .attr('y', o.players.offset_singles + o.players.offset_doubles)
      .attr('class', 'modalPositionOptions')
      .attr('modalPosition', 'opponentName teamPosition_1')
      .attr('positionIndex', '1')
      .html((d) => P.name(d, 1), lengthThreshold)
      .style('font-weight', (d) => P.playerBold(d))
      .style('fill', (d) => P.playerColor(d))
      .style('shape-rendering', 'geometricPrecision')
      .style('font-size', nameSize)
      .on('click', (d) => invoke(d, 'person.click', 1))
      .on('mouseover', (d, i) => P.highlightCell(d, i, root))
      .on('mouseout', (d, i) => P.unHighlightCell(d, i, root))
      .on('contextmenu', (d) => invoke(d, 'person.contextmenu'), 1);

    if (team && o.details.teams) {
      node
        .append('text')
        .attr('class', 'modalPositionOptions')
        .attr('modalPosition', 'teamDisplay')
        .attr('teamDisplay', (d) => P.teamDisplay(d, 0, true))
        .attr('text-anchor', 'end')
        .attr('x', o.team.offset)
        .attr('y', o.players.offset_singles)
        .html((d) => P.teamDisplay(d, 0))
        .style('font-weight', (d) => P.playerBold(d))
        .style('fill', (d) => P.playerColor(d))
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', teamSize)
        .on('mouseover', (d) => P.mouseOverTeam(d, 0, root))
        .on('mouseout', (d) => P.mouseOutTeam(d, 0, root));

      node
        .append('text')
        .attr('class', 'modalPositionOptions')
        .attr('modalPosition', 'teamDisplay')
        .attr('teamDisplay', (d) => P.teamDisplay(d, 1, true))
        .attr('text-anchor', 'end')
        .attr('x', o.team.offset)
        .attr('y', o.players.offset_singles + o.players.offset_doubles)
        .html((d) => P.teamDisplay(d, 1))
        .style('font-weight', (d) => P.playerBold(d))
        .style('fill', (d) => P.playerColor(d))
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', teamSize)
        .on('mouseover', (d) => P.mouseOverTeam(d, 1, root))
        .on('mouseout', (d) => P.mouseOutTeam(d, 1, root));
    }

    node
      .append('text')
      .attr('x', playerBaseX)
      .attr('y', o.players.offset_score)
      .attr('class', 'modalPositionOptions')
      .attr('modalPosition', 'matchDetail')
      .attr('text-anchor', 'start')
      .attr('dy', '.71em')
      .text((d) => matchDetail(d, o, info))
      .style('fill', scoreDetail)
      .style('shape-rendering', 'geometricPrecision')
      .style('font-size', scoreSize)
      .on('click', (d) => invoke(d, 'score.click'))
      .on('mouseover', events.score.mouseover)
      .on('mouseout', events.score.mouseout)
      .on('contextmenu', (d) => invoke(d, 'score.contextmenu'));

    if (o.umpires.display) {
      node
        .append('text')
        .attr('x', playerBaseX)
        .attr('y', o.umpires.offset)
        .attr('text-anchor', 'start')
        .attr('dy', '.71em')
        .attr('class', 'modalPositionOptions')
        .attr('modalPosition', 'statusDetail')
        .text(statusDetail)
        .style('fill', o.umpires.color)
        .style('stroke', o.umpires.color)
        .style('shape-rendering', 'geometricPrecision')
        .style('font-size', scoreSize)
        .style('font-style', 'italic')
        .on('click', (d) => invoke(d, 'umpire.click'))
        .on('mouseover', events.umpire.mouseover)
        .on('mouseout', events.umpire.mouseout)
        .on('contextmenu', (d) => invoke(d, 'umpire.contextmenu'));
    }

    function nameSize() {
      const ctl = this.getComputedTextLength();
      let size = Math.round((roundWidth * o.names.length_divisor) / ctl);
      if (size > o.names.max_font_size) size = o.names.max_font_size;
      if (size < o.names.min_font_size) size = o.names.min_font_size;
      return size + 'px';
    }

    function teamSize() {
      const ctl = this.getComputedTextLength();
      let size = Math.round(((roundWidth + o.detail_offsets.first_round) * o.teams.length_divisor) / ctl);
      if (size > o.names.max_font_size) size = o.names.max_font_size;
      if (size < o.names.min_font_size) size = o.ames.min_font_size;
      return size + 'px';
    }

    function scoreSize() {
      const ctl = this.getComputedTextLength();
      let size = Math.round((roundWidth * 10) / ctl);
      if (size > o.scores.max_font_size) size = o.scores.max_font_size;
      return size + 'px';
    }

    function baseX(d, i) {
      const x = -1 * roundWidth;
      // XXX: x + roundWidth evaluates to 0...
      // but useful if defintion of x changes as in playerBaseX()
      return +i === 0 && invert_first ? x + roundWidth : x;
    }

    function playerBaseX(d, i) {
      const feed = d.data && d.data.feed;
      const base = -1 * roundWidth + o.players.offset_left;
      const x = +i === 0 && invert_first ? base + roundWidth : base;
      const pbx = d.height || feed ? x : x - additional_width - o.detail_offsets.first_round;
      return pbx;
    }

    function dpX(d, i) {
      const x = baseX(d, i) - left_column_offset + o.detail_offsets.width;
      return x;
    }

    function prX(d) {
      let x = baseX(d) - o.detail_offsets.base - seeding - additional_width - o.detail_offsets.first_round;
      if (o.details.drawEntry && info.dataScan.drawEntry) x -= o.detail_offsets.width;
      return x;
    }

    function deX(d, i) {
      const x = baseX(d, i) - o.detail_offsets.base - seeding / 1.8 - additional_width - o.detail_offsets.first_round;
      return x;
    }

    function textX(d, i) {
      const x = playerBaseX(d, i);
      return x;
    }
  }

  function drawVisibility(d) {
    return o.max_round && d.target.height + 1 > o.max_round ? 0 : 1;
  }

  chart.unHighlightCells = function () {
    root.selectAll('.editField').attr('fill', o.edit_fields.color);
  };

  chart.selector = function (value) {
    if (!arguments.length) {
      return o.selector;
    }
    o.selector = value;
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

  chart.events = function (functions) {
    if (!arguments.length) return events;
    keyWalk(functions, events);
    return chart;
  };

  chart.data = function ({ matchUps, participants, nextUnfilledDrawPositions } = {}) {
    if (!matchUps && !participants) return chart;

    const { hierarchy, maxRound, finalRound } = drawEngine.buildDrawHierarchy({ matchUps, participants });
    if (hierarchy) data.hierarchy = hierarchy;

    if (matchUps && Array.isArray(matchUps)) {
      info.firstRoundPositionsCount = matchUps.filter((matchUp) => matchUp.roundNumber === 1).length * 2;
      info.maxRound = finalRound;
      info.limitRound = maxRound;

      const { feedIn, fedCount, feedRounds } = feedAnalysis({ matchUps, maxRound });
      Object.assign(info, { feedIn, fedCount, feedRounds });

      info.feedIn = feedIn;
      info.zoom = false; // zoom will change the multiplier for playerHeight
    }

    if (participants) {
      P.participants = participants;
      P.nextUnfilledDrawPositions = nextUnfilledDrawPositions;
      info.hasDoubles = hasDoubles({ matchUps });
      info.hasTeams = hasTeams({ matchUps });
      info.hasNationalities = hasNationalities({ participants });
    }

    info.dataScan = scanData({ matchUps, participants });
    P.info = info;

    return chart;
  };

  return chart;

  function getCoords() {
    const evt = d3Event;
    const mouse = o.selector ? d3Mouse(o.selector) : [0, 0];
    return {
      selector_x: mouse[0],
      selector_y: mouse[1],
      screen_x: evt.clientX,
      screen_y: evt.clientY
    };
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
