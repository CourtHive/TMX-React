import { env } from 'config/defaults';
import { reverseStringScore } from 'functions/scoring/reverseStringScore';
import { potentialBlock } from 'engineFactory/pdfEngine/primitives';

import { normalizeName } from 'normalize-text';
import i18n from 'i18next';
import { convertTime } from 'competitionFactory/utilities/dateTime';
import { offsetDate } from 'competitionFactory/utilities/dateTime';

export function matchDesignator() {
  /*
  let evt = matchUp && matchUp.event && findDrawDefinitionById({tournament, drawId: matchUp.event.euid});
  let category = (evt && evt.category && evt.category.slice(0,4)) || '';
  return `${evt.gender}${evt.format}${category}`;
  */
}

export function matchDate(matchUp) {
  if (matchUp.schedule && matchUp.schedule.day) return datePDF(new Date(matchUp.schedule.day));
  if (matchUp.date) return datePDF(matchUp.date);
  return '';

  function datePDF(timestamp) {
    const date = offsetDate(timestamp);
    return [zeroPad(date.getMonth() + 1), zeroPad(date.getDate())].join('-');
  }
}
export function matchRound(matchUp) {
  return matchUp.roundNumber;
}
export function matchCourt(matchUp) {
  return (matchUp.schedule && matchUp.schedule.court) || '';
}
export function matchRow(matchUp) {
  return [
    matchDate(matchUp),
    matchRound(matchUp),
    teamBlock({ matchUp, side: 'left' }),
    teamBlock({ matchUp, side: 'right' }),
    matchCourt(matchUp),
    getMatchUpStattus(matchUp, env)
  ];
}

export function completedMatchRow(matchUp) {
  return [
    matchDate(matchUp),
    matchRound(matchUp),
    teamBlock({ matchUp, side: 'left' }),
    teamBlock({ matchUp, side: 'right' }),
    '',
    matchScore(matchUp)
  ];
}

export function getMatchUpStattus(matchUp, env) {
  const start_time =
    matchUp.schedule && matchUp.schedule.start ? `${i18n.t('draws.starttime')}: ${matchUp.schedule.start}` : '';
  const scheduled_time =
    matchUp.schedule && matchUp.schedule.time
      ? `${i18n.t('schedule.scheduled')}: ${convertTime(matchUp.schedule.time, env)}`
      : '';
  return matchUp.status || start_time || scheduled_time;
}

export function matchScore(matchUp, non_breaking) {
  let scr = matchUp.score || matchUp.delegated_score || '';
  if (matchUp.winner_index === 1) scr = reverseStringScore(scr);
  // eslint-disable-next-line no-useless-escape
  return scr && non_breaking ? scr.replace(/\-/g, '&#8209;') : scr;
}

export function matchTime(matchUp, env) {
  return (matchUp.schedule && matchUp.schedule.time && convertTime(matchUp.schedule.time, env)) || '';
}

export function teamBlock({ matchUp, side = 'left', assoc }) {
  const left_position = 0;
  const right_position = 1;

  const lp = matchUp.team_players[left_position];
  const rp = matchUp.team_players[right_position];
  const doubles = (lp && lp.length === 2) || (rp && rp.length === 2);

  const left_team =
    (lp && lp.map((p) => playerBlock({ matchUp, doubles, pindex: p, side: 'left', assoc })).join('/')) ||
    unknownBlock(matchUp, left_position) ||
    i18n.t('unk');
  const right_team =
    (rp && rp.map((p) => playerBlock({ matchUp, doubles, pindex: p, side: 'right', assoc })).join('/')) ||
    unknownBlock(matchUp, right_position) ||
    i18n.t('unk');
  return side === 'right' ? right_team : left_team;
}

export function unknownBlock(matchUp, pindex) {
  if (!matchUp.potentials) return '';
  const index = matchUp.potentials[pindex] ? pindex : 0;
  const potentials = matchUp.potentials[index];
  if (!potentials || potentials.filter((f) => f).length < 2) return i18n.t('unk');
  return potentials.map((p) => p.map(potentialBlock).join('/')).join(` ${i18n.t('or')} `);
}

export function playerBlock({ matchUp, doubles, pindex, side, assoc = '' }) {
  const p = matchUp.players[pindex];
  const left = side === 'right' ? `${assoc} ` : '';
  const right = side === 'left' ? ` ${assoc}` : '';
  let first_name = doubles ? '' : normalizeName(p.first_name, false);
  let last_name = p.last_name ? normalizeName(p.last_name, false).toUpperCase() : '';
  if (p.otherName) {
    first_name = '';
    last_name = p.otherName.toUpperCase();
  }
  const first_doubles = doubles && !pindex;
  const seed = p.seed && !first_doubles ? ` [${p.seed}]` : '';
  return `${left}${first_name} ${last_name}${seed}${right}`;
}

function zeroPad(number) {
  return number.toString()[1] ? number : '0' + number;
}
