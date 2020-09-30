import { env } from 'config/defaults';

import { utilities } from 'tods-competition-factory';
const { convertTime, DateHHMM } = utilities.dateTime;

function getMatchUp(d) {
  if (d && d.data) {
    const matchUpId = d.data.matchUpId;
    return matchUpId && d.data;
  }
}

export function scoreDetail(d) {
  const matchUp = getMatchUp(d);
  const { delegated } = getScore(matchUp);
  return delegated ? '#777777' : '#000';
}

export function statusDetail(d) {
  const matchUp = getMatchUp(d);
  const umpire = matchUp && matchUp.umpire && matchUp.umpire.toUpperCase();
  const status = matchUp && matchUp.status;
  return status && umpire ? `${status}: ${umpire}` : status || umpire || '';
}

export function matchDetail(d, o, info) {
  if (
    (o.details.playerRankings && info.dataScan.playerRankings) ||
    (o.details.playerRatings && info.dataScan.playerRatings)
  ) {
    // if this is a feed arm then add player ranking or rating
    if (d.data.drawPosition) {
      const isFedParticipant = d.data.roundNumber !== 1;
      if (isFedParticipant) {
        console.log('feed arm... get participant info from matchUp');
        /*
            if (d.data && d.data.feed && side) {
               let player = side[0];
               let ranking_rating = P.rankingRating(player);
               return ranking_rating || '';
            }
            */
      }
    }
  }

  const matchUp = getMatchUp(d);
  if (!matchUp) return;

  const { score } = getScore(matchUp);
  if (score) return score;

  const schedule = matchUp.schedule;
  if (schedule) {
    const timeString = !o.schedule.times ? '' : timeDisplay(schedule);
    const scheduleAfter = o.schedule.after && schedule.after ? `~${schedule.after}` : '';
    const courtDisplay = o.schedule.identifiers
      ? schedule.court || ''
      : (schedule.court && schedule.court.split(' ')[0]) || '';
    const courtInfo = !o.schedule.courts ? '' : [courtDisplay || '', scheduleAfter].join(' ');
    return [timeString || '', courtInfo || ''].join(' ');
  }

  return '          ';
}

export function dateDetail(d, o) {
  const matchUp = getMatchUp(d);
  if (!matchUp || matchUp.score) return;
  const schedule = matchUp.schedule;
  if (o.schedule.dates && schedule && schedule.day) {
    const date = ymd2date(schedule.day);
    const weekday = date.getDay();
    const dayAbbreviation = o.matchdates.weekdaysShort[weekday].toUpperCase();
    const month = date.getMonth();
    const monthAbbreviation = o.matchdates.monthsShort[month].toUpperCase();
    return `${dayAbbreviation}. ${monthAbbreviation} ${date.getDate()}`;
  }
}

function ymd2date(ymd) {
  const parts = ymd.split('-');
  if (!parts || parts.length !== 3) return new Date(ymd);
  if (isNaN(parseInt(parts[1]))) return new Date(ymd);
  return new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
}

function timeDisplay(schedule) {
  const scheduleTime = schedule && (schedule.startTime || schedule.scheduledTime);
  const displayTime = convertTime(DateHHMM(scheduleTime), env);
  return scheduleTime ? displayTime : '';
}

function getScore(matchUp) {
  return {
    score: matchUp && (matchUp.score || matchUp.delegated_score),
    delegated: matchUp && !matchUp.score && matchUp.delegated_score
  };
}
