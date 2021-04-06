import { env } from 'config/defaults';
import { tieMatchUps } from 'functions/draws/drawMatches';
import { opponentName } from 'components/options/opponents';
import { drawSheetPageHeader } from 'engineFactory/pdfEngine/headers/drawSheetHeader';
import { convertStringScore } from 'functions/scoring/convertStringScore';

import { utilities } from 'tods-competition-factory';

import i18n from 'i18next';

export function dualSheet({ tournament = {}, data, adhoc_matches, logo, selectedEvent, event }) {
  let evt = event || (tournament.events && tournament.events[selectedEvent]);
  // let player_representatives = evt && evt.player_representatives || [];
  // let event_organizers = tournament && tournament.organizers ? [tournament.organizers] : [];
  // let created = event.draw_created && isDate(event.draw_created) ? new Date(event.draw_created) : new Date();
  // let timestamp = localizeDate(created, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  let page_header = drawSheetPageHeader(tournament, logo, 'draw_sheet', selectedEvent, event);

  let matches =
    (adhoc_matches && adhoc_matches.length && adhoc_matches) || tieMatchUps(evt, data.dual_match.matchUp.muid);

  let team_header = adhoc_matches ? '' : TieMatchUpsTeams(data.dual_teams);
  let scoreboxes = matches.map(dualMatchBox);
  let dual_matches = TieMatchUpsTable(scoreboxes);

  //let date = new Date(tournament.startDate);
  // let year = date.getFullYear();
  // let month = date.getMonth();

  let content = [page_header, team_header, dual_matches];

  var docDefinition = {
    pageSize: env.printing.pageSize,
    pageOrientation: 'portrait',

    pageMargins: [10, 20, 10, 10],

    content,
    styles: {
      scoreBox: {
        margin: [0, 0, 0, 0],
        fontSize: 10
      },
      matchHeader: {
        bold: true,
        fontSize: 11,
        color: 'black'
      },
      roundHeader: {
        bold: true,
        italics: true,
        fontSize: 12,
        color: 'black'
      },
      gameScore: {
        alignment: 'center',
        fontSize: 9,
        bold: true
      },
      centeredColumn: {
        alignment: 'center'
      }
    }
  };

  return { docDefinition };
}

function TieMatchUpsTeams(dual_teams) {
  let team1 = dual_teams[0].full_name || '';
  let team2 = dual_teams[1].full_name || '';

  let t = {
    table: {
      widths: [30, '*', 25, '*', 30],
      body: [['', { text: team1, style: 'centeredColumn' }, 'vs.', { text: team2, style: 'centeredColumn' }, '']]
    },
    layout: {
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 20,
      paddingBottom: () => 1,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => 0,
      vLineColor: () => 0
    }
  };
  return t;
}

function TieMatchUpsTable(scoreboxes) {
  let groups = utilities.chunkArray(scoreboxes, 2);
  let scoreRow = (group) => [group[0] || '', '', group[1] || ''];
  let body = groups.map(scoreRow);

  let t = {
    table: {
      dontBreakRows: true,
      widths: [270, 30, 270],
      body
    },
    layout: {
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 20,
      paddingBottom: () => 1,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => 0,
      vLineColor: () => 0
    }
  };

  return t;
}

function dualMatchBox(matchUp) {
  let winner_index = matchUp.matchUp.winner_index;
  let existing = matchUp.matchUp.score
    ? convertStringScore({
        string_score: matchUp.matchUp.score,
        matchUpFormat: matchUp.matchUp.matchUpFormat,
        winner_index
      })
    : undefined;
  let sets = existing || [];
  while (sets.length < 5) sets.unshift([{}, {}]);

  let scores = sets.map((set, i) => set.map((o) => opponentScore(o, i)));

  function getScore(o) {
    return o.games !== undefined ? o.games : o.supertiebreak || '';
  }
  // function getTiebreak(o) { return o.tiebreak !== undefined ? o.tiebreak : o.spacer ? '&nbsp;' : ''; }
  function opponentScore(opponent, i) {
    let border = [false, true, i === 4 ? true : false, true];
    return { text: getScore(opponent), style: 'gameScore', border };
  }
  function maxTextLength(set) {
    return set.reduce((p, c) => (c.text.toString().length > p ? c.text.toString().length : p), 0);
  }

  let total_width = 250;
  let score_sizes = { 1: 7, 2: 12 };
  let score_lengths = scores.map(maxTextLength);
  let score_widths = score_lengths.map((l) => score_sizes[l] || 0);
  let score_width = score_widths.reduce((p, c) => p + c, 0);
  let opponents_width = total_width - score_width;
  let team1_width = matchUp.format === 'singles' ? opponents_width : opponents_width / 2;
  let team2_width = matchUp.format === 'singles' ? 0 : opponents_width / 2;

  let widths = [team1_width, team2_width, ...score_widths];

  let scorebox = {
    style: 'scoreBox',
    color: '#444',
    table: {
      widths,
      headerRows: 1,
      body: [matchHeader(matchUp), teamScoreLine(matchUp, scores, 0), teamScoreLine(matchUp, scores, 1)]
    },
    layout: {
      paddingLeft: () => 1,
      paddingRight: () => 1

      // paddingTop: function(i, node) { return 1; },
      // paddingBottom: function(i, node) { return 2; },
      // hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; },
      // vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; },
      // hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? 'black' : 'gray'; },
      // vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray'; },
      // fillColor: function (i, node) { return (i % 2 === 0) ? '#000000' : null;}
    }
  };

  return scorebox;

  function matchHeader(matchUp) {
    // let order = !matchUp || !matchUp.order ? '1' : matchUp.order;
    let rndnm = matchUp.round ? `${i18n.t('rnd')} ${matchUp.round}` : '';
    let format = (matchUp && matchUp.format && matchUp.format[0].toUpperCase() + matchUp.format.slice(1)) || 'Singles';
    let identifier = matchUp.sequence ? `${matchUp.round_name || ''} #${matchUp.sequence} ${format}` : rndnm;
    return [
      { text: identifier, fillColor: '#eeeeee', style: 'matchHeader', colSpan: 7, alignment: 'center' },
      {},
      {},
      {},
      {},
      {},
      {}
    ];
  }

  function playerScoreLine(matchUp, scores, index = 0) {
    let opponent = matchUp && matchUp.teams && matchUp.teams[index] && matchUp.teams[index][0];
    let opponent_name = opponentName({ opponent }) || `${i18n.t('opnt')} ${index + 1}`;
    let player_score = scores.map((s) => s[index]);
    let line = [{ text: opponent_name, border: [true, true, false, true], colSpan: 2 }, '', ...player_score];
    return line;
  }

  function teamScoreLine(matchUp, scores, index) {
    if (!matchUp.format || matchUp.format === 'singles') return playerScoreLine(matchUp, scores, index);
    let team = matchUp && matchUp.teams && matchUp.teams[index];
    let opponent1 = opponentName({ opponent: team && team[0], length_threshold: 20 });
    let opponent1_name = opponent1 || `${i18n.t('opnt')} ${index + 1}`;
    let opponent2 = opponentName({ opponent: team && team[1], length_threshold: 20 });
    let opponent2_name = opponent2 || `${i18n.t('opnt')} ${index + 1}`;

    let team_score = scores.map((s) => s[index]);
    let line = [
      { text: opponent1_name, border: [true, true, false, true] },
      { text: opponent2_name, border: [false, true, false, true] },
      ...team_score
    ];
    return line;
  }
}
