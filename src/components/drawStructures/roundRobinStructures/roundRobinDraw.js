import { select as d3Select } from 'd3';
import roundRobinBracket from './roundRobinBracket';
import { keyWalk, roundRobinDefaultOptions } from './roundRobinDefaultOptions';

// import { drawEngine } from 'competitionFactory';
import { drawEngine } from 'tods-competition-factory';

export function roundRobinDraw() {
  const o = roundRobinDefaultOptions();

  let root;
  const bracket_charts = [];
  const data = { brackets: [] };

  const events = {
    score: { click: null, mouseover: highlightCell, mouseout: unHighlightCells, contextmenu: null },
    player: { click: null, mouseover: null, mouseout: unHighlightPlayer, contextmenu: null },
    info: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    qorder: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    result: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    drawPosition: { click: null, mouseover: null, mouseout: null, contextmenu: null },
    sizing: { width: null } // optional functions for sizeToFit
  };

  function chart() {
    root = d3Select(o.selector || 'body');

    const ref_width = document.querySelector(o.ref_width_selector)
      ? +d3Select(o.ref_width_selector).style('width').match(/\d+/)[0] * o.ref_width_factor
      : undefined;
    const draw_width = o.width || Math.max(ref_width || 0, o.min_width);

    if (!data.brackets || !data.brackets.length) return;
    const seed_limit = data.brackets.length * 2;

    const html = data.brackets.map((_, i) => `<div id='${o.id}_${i}'></div>`).join('');
    root.html(html);

    data.brackets.forEach((bracket, i) => {
      bracket_charts[i] = roundRobinBracket()
        .reset()
        .events(events)
        .seedLimit(seed_limit)
        .selector(`#${o.id}_${i}`)
        .options({
          sizeToFit: o.sizeToFit,
          width: draw_width,
          height: o.height || o.min_height,
          minPlayerHeight: o.minPlayerHeight,

          seeds: o.seeds,
          names: o.names,
          scores: o.scores,
          bracket: o.bracket,
          details: o.details,
          margins: o.margins,
          qualifying: o.qualifying,
          score_cells: o.score_cells,
          matchUpFormat: o.matchUpFormat
        })
        .bracketData(bracket);
    });

    // call each bracket object to generate view
    data.brackets.forEach((bracket, i) => bracket_charts[i]());
  }

  chart.events = function (obj) {
    if (!arguments.length) return events;
    keyWalk(obj, events);
    return chart;
  };

  chart.updateBracket = function (bracketIndex, reset) {
    if (reset) bracket_charts[bracketIndex].reset();

    bracket_charts[bracketIndex]
      .bracketName(data.brackets[bracketIndex].name)
      .addParticipants(data.brackets[bracketIndex].participants)
      .addMatches(data.brackets[bracketIndex].matchUps)
      .addByes(data.brackets[bracketIndex].byes)
      .participantResults(data.brackets[bracketIndex].participantResults);

    bracket_charts[bracketIndex]();
    return chart;
  };

  chart.brackets = function () {
    return bracket_charts;
  };

  chart.options = function (values) {
    if (!arguments.length) return o;
    keyWalk(values, o);
    return chart;
  };

  chart.data = function (drawData) {
    if (!arguments.length) {
      return data;
    }
    const brackets = buildBrackets({ drawData });
    data.brackets = brackets;
    return chart;
  };

  chart.selector = function (value) {
    if (!arguments.length) {
      return o.selector;
    }
    o.selector = value;
    return chart;
  };

  chart.unHighlightCells = unHighlightCells;
  function unHighlightCells() {
    Array.from(root.node().querySelectorAll('.rr_score')).forEach((e) => {
      e.style.fill = e.classList.contains('LIVE') ? o.score_cells.live_color : o.score_cells.color;
    });
  }

  chart.highlightCell = highlightCell;
  function highlightCell(d) {
    if (!d) return;
    if (!d.teams || d.teams.indexOf(undefined) >= 0) return;
    const cell_selector = `.rr${d.bracket}_${d.attr}_${d.row}_${d.mc}`;
    const cell = root.node().querySelector(cell_selector);
    if (cell) cell.style.fill = o.score_cells.highlight_color;
  }

  chart.highlightPlayer = highlightPlayer;
  function highlightPlayer(bracket, row, highlight = true) {
    const cell_selector = `.rr${bracket}_player_${row}`;
    const cell = root.node().querySelector(cell_selector);
    if (cell) cell.style.fill = highlight ? o.player_cells.highlight_color : o.player_cells.color;
  }

  chart.unHighlightPlayer = unHighlightPlayer;
  function unHighlightPlayer() {
    Array.from(root.node().querySelectorAll('.rr_player')).forEach((e) => (e.style.fill = o.player_cells.color));
  }

  return chart;
}

function buildBrackets({ drawData }) {
  const structures = (drawData.structure && drawData.structure.structures) || [];
  const { structureId } = drawData.structure || {};
  const brackets = structures.map((structure) => {
    const positionAssignments = structure.positionAssignments;
    const participantDrawPositions = positionAssignments
      .filter((assignment) => assignment.participantId)
      .map((assignment) => ({ [assignment.participantId]: assignment.drawPosition }));
    const drawPositionMap = Object.assign({}, ...participantDrawPositions);
    const byes = positionAssignments
      .filter((assignment) => assignment.bye)
      .map((assignment) => ({ drawPosition: assignment.drawPosition }));

    const matchUpIds = structure.matchUps.map((matchUp) => matchUp.matchUpId);
    const matchUps = drawData.matchUps.filter((matchUp) => matchUpIds.includes(matchUp.matchUpId));
    const bracketDrawPositions = matchUps.reduce((drawPositions, matchUp) => {
      const drawPositionsToAdd = matchUp.drawPositions.filter(
        (drawPosition) => drawPosition && !drawPositions.includes(drawPosition)
      );
      return drawPositions.concat(...drawPositionsToAdd);
    }, []);
    const initialBracketPosition = Math.min(...bracketDrawPositions);
    const participants = drawData.participants.map((participant) => {
      const drawPosition = drawPositionMap[participant.participantId];
      return Object.assign({}, participant, { drawPosition, structureId });
    });

    // const matchUpFormat = drawData.drawDefinition.matchUpFormat;
    // const { participantResults } = drawEngine.tallyParticipantResults({ matchUps, matchUpFormat });

    const bracket = {
      nextUnfilledDrawPositions: drawData.nextUnfilledDrawPositions,
      positionsCount: structure.positionAssignments.length,
      bracketIndex: structure.structureIndex - 1,
      drawId: drawData.drawDefinition.drawId,
      name: structure.structureName,
      initialBracketPosition,
      participantResults: {},
      participants,
      structureId, // structureId for the CONTAINER is different thand structureId for the bracket
      structure,
      matchUps,
      byes
    };

    return bracket;
  });
  return brackets;
}
