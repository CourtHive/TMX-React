import { env } from 'config/defaults';
import { convertTime } from 'competitionFactory/utilities/dateTime';

import { reverseStringScore } from 'functions/scoring/reverseStringScore';
import i18n from "i18next";

import { lastName, fullName, potentialBlock } from 'engineFactory/pdfEngine/primitives';

const containsNumber = (value) => /\d/.test(value);

export function scheduleCell(matchUp, lines=false) {
  var format = i18n.t(`formats.${matchUp.format || ''}`);
  var category = matchUp.event ? matchUp.event.category : '';
  var heading = (matchUp.schedule && matchUp.schedule.heading) ? `${matchUp.schedule.heading} ` : '';
  var time_prefix = (matchUp.schedule && matchUp.schedule.time_prefix) ? `${matchUp.schedule.time_prefix} ` : '';
  var match_time = (matchUp.schedule && matchUp.schedule.time) ? `${convertTime(matchUp.schedule.time, env)}` : '';
  var time_detail = `${heading}${time_prefix}${match_time}`;
  var score = containsNumber(matchUp.score) && matchUp.score.indexOf('LIVE') < 0 && matchUp.score;

  let reverse_scores = env.schedule && !env.schedule.scores_in_draw_order;
  if (score && matchUp.winner === 1 && reverse_scores) score = reverseStringScore(score);
  var unknowns = [];

  var first_team = matchUp.team_players && matchUp.team_players[0] ? teamName(matchUp, matchUp.team_players[0]) : unknownBlock(matchUp, 0);
  var second_team = matchUp.team_players && matchUp.team_players[1] ? teamName(matchUp, matchUp.team_players[1]) : unknownBlock(matchUp, 1);

  var display = {
     time_detail,
     round: `${matchUp.gender || ''} ${category} ${format} ${matchUp.round_name || ''}`,
     oop: matchUp.oop || '',
     first_team,
     bold1: matchUp.winner !== undefined && matchUp.winner === 0 ? true : false,
     color1: playerColor(matchUp, 0),
     italics1: playerItalics(0),
     vs: matchUp.players ? 'vs.' : '',
     second_team,
     bold2: matchUp.winner !== undefined && matchUp.winner === 1 ? true : false,
     color2: playerColor(matchUp, 1),
     italics2: playerItalics(1),
     spacer: matchUp.spacer || '',
     scoreline: `${score || ''}`,
     colorscore: matchUp.winner_index !== undefined ? 'green' : 'black',
     boldscore: matchUp.winner_index !== undefined ? true : false
  };
  if (matchUp.event && matchUp.event.custom_category) display.round = `${matchUp.event.custom_category} ${matchUp.round_name || ''}`;

  // this was for highlighting teams
  // let background_color = context && context.schedule_filters.teamid && teamsFx.includesTeam({ matchUp, id: context.schedule_filters.teamid }) ? '#F5B5FD' : '';
  let background_color = '';

  var x = ' ';
  var cell = {
     fillColor: background_color,
     table: {
        widths: ['*'],
        body: [
           [ { text: display.time_detail || x, style: 'centeredText', margin: [0, 0, 0, 0] } ],
           [ { text: display.round || x, style: 'centeredItalic', margin: [0, 0, 0, 0] } ],
           [ { text: display.oop || x, style: 'centeredText', margin: [0, 0, 0, 0] } ],
           [ { text: display.first_team || x, style: 'teamName', margin: [0, 0, 0, 0], bold: display.bold1, color: display.color1, italics: display.italics1 } ],
           [ { text: display.vs || x, style: 'centeredText', margin: [0, 0, 0, 0] } ],
           [ { text: display.second_team || x, style: 'teamName', margin: [0, 0, 0, 0], bold: display.bold2, color: display.color2, italics: display.italics2 } ],
           [ { text: display.spacer || x, style: 'centeredText', margin: [0, 0, 0, 0] } ],
           [ { text: display.scoreline || x, style: 'centeredText', margin: [0, 0, 0, 0], bold: display.boldscore, color: display.colorscore } ]
        ]
     },
     layout: {
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
        hLineWidth: function (i, node) { return (lines && (i === 0 || i === node.table.body.length)) ? 1 : 0; },
        vLineWidth: function (i, node) { return (lines && (i === 0 || i === node.table.widths.length)) ? 1 : 0; }
     }
  }; 
  return cell;

  function playerItalics(pindex) { return (unknowns.indexOf(pindex) >= 0); }
  function unknownBlock(matchUp, pindex) {
     if (!matchUp.potentials) return '';
     unknowns.push(pindex);
     let index = matchUp.potentials[pindex] ? pindex : 0;
     let potentials = matchUp.potentials[index];
     if (!potentials || potentials.filter(f=>f).length < 2) return i18n.t('unk');
     return potentials.map(p=>p.map(potentialBlock).join('/')).join(` ${i18n.t('or')} `);
  }

  function playerColor(matchUp, index) {
     if (unknowns.indexOf(index) >= 0) return 'gray';
     if (matchUp.winner === undefined) return 'black';
     return (matchUp.winner === index) ? 'green' : 'gray';
  }
}

 function teamName(matchUp, team) {
    let p = matchUp.players[team[0]];
    if (!p) {
       return i18n.t('unk');
    } else if (team.length === 1) {
       if (!p.id) return potentialBlock(p);
       let code_content = p.team_code;
       let code = code_content ? ` (${code_content})` : '';
       return `${fullName(p)}${code}`;
    } else {
       let team_codes = team
          .reduce((p, c) => !matchUp.players[c] || p.indexOf(matchUp.players[c].team_code) >= 0 ? p : p.concat(matchUp.players[c].team_code), [])
          .filter(f=>f)
          .join('/');
       let team_code = team_codes ? ` (${team_codes})` : '';
       let dbls_name = team
          .map(t => !matchUp.players[t] ? i18n.t('opnt') : lastName(matchUp.players[t]).toUpperCase())
          .join('/');
       return `${dbls_name}${team_code}`;
    }
 }
 