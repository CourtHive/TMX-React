import { env } from 'config/defaults';
import { normalizeDiacritics, normalizeName } from 'normalize-text';

import { utilities } from 'tods-competition-factory';
const {
  dateTime: { formatDate }
} = utilities;

export const exportCSV = (function () {
  const fx = {};

  function download(filename, dataStr) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('href', dataStr);
    a.setAttribute('download', filename);
    const elem = document.body.appendChild(a);
    elem.click();
    elem.remove();
  }

  fx.downloadText = (filename, text) => {
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    download(filename, dataStr);
  };

  fx.json2csv = json2csv;
  function json2csv(records, separator = ',') {
    if (!records.length) return false;
    const keys = Object.keys(records[0]);
    const delimiter = (item) => `"${item}"`;
    return (
      keys.join(separator) +
      '\n' +
      records.map((records) => keys.map((key) => delimiter(records[key])).join(separator)).join('\n')
    );
  }

  // ITF Export

  function matchDate(matchUp, which) {
    if (!matchUp.schedule) return '';
    if (which && matchUp.schedule[which]) return new Date(matchUp.schedule[which]).toISOString();
    return matchUp.schedule.day || '';
  }

  function setScores(scores = []) {
    const result = {};
    const five_sets = scores.concat([[], [], [], [], []]).slice(0, 5);
    five_sets.forEach((set, i) => {
      const s1 = getGames(set, 0);
      const s2 = getGames(set, 1);
      result[`ScoreSet${i + 1}Side1`] = s1 || (s2 ? 0 : '');
      result[`ScoreSet${i + 1}Side2`] = s2 || (s1 ? 0 : '');
      result[`ScoreSet${i + 1}LosingTiebreak`] = getTiebreak(set, 0) || getTiebreak(set, 1);
      const p1 = getSuperTiebreak(set, 0);
      const p2 = getSuperTiebreak(set, 1);
      if (p1 || p1) {
        const winning = Math.max(p1, p2);
        const losing = Math.min(p1, p2);
        result[`ScoreSet${i + 1}WinningTiebreak`] = winning;
        result[`ScoreSet${i + 1}LosingTiebreak`] = losing || 0;
      }
    });

    return result;

    function getGames(arr, i) {
      return (Array.isArray(arr) && arr[i] && arr[i].games) || '';
    }
    function getTiebreak(arr, i) {
      return (Array.isArray(arr) && arr[i] && arr[i].tiebreak) || '';
    }
    function getSuperTiebreak(arr, i) {
      return (Array.isArray(arr) && arr[i] && arr[i].supertiebreak) || '';
    }
  }

  fx.ITFmatchRecord = ({ matchUp, tournament = {}, pinid_map }) => {
    if (matchUp.winner_index === undefined) {
      return console.log('matchUp:', matchUp);
    }
    const match_type = matchUp.players.length > 2 ? 'D' : 'S';

    const p1 = matchUp.players[matchUp.team_players[0][0]];
    const p2 = matchUp.players[matchUp.team_players[0][1]];
    const p3 = matchUp.players[matchUp.team_players[1][0]];
    const p4 = matchUp.players[matchUp.team_players[1][1]];

    const indoorOutdoor = matchUp.tournament.indoorOutdoor || tournament.indoorOutdoor;

    const getID = (id) => pinid_map[id] || id;

    const match_record = {
      MatchID: matchUp.muid,

      Side1Player1ID: (p1 && getID(p1.id)) || '',
      Side1Player2ID: (p2 && getID(p2.id)) || '',
      Side2Player1ID: (p3 && getID(p3.id)) || '',
      Side2Player2ID: (p4 && getID(p4.id)) || '',

      MatchWinner: +matchUp.winner_index + 1,
      SurfaceType: matchUp.event.surface || '',
      Score: matchUp.score,

      MatchUpType: match_type,
      TournamentID: matchUp.tournament.tournamentId,
      TournamentName: matchUp.tournament.name,

      MatchStartDate: matchDate(matchUp, 'start'),
      MatchEndDate: matchDate(matchUp, 'end'),

      TournamentStartDate: (matchUp.tournament.startDate && new Date(matchUp.tournament.startDate).toISOString()) || '',
      TournamentEndDate: (matchUp.tournament.endDate && new Date(matchUp.tournament.endDate).toISOString()) || '',

      AgeCategoryCode: matchUp.event.category,
      IndoorFlag: indoorOutdoor === 'i' ? 'true' : indoorOutdoor === 'o' ? 'false' : '',
      Grade: matchUp.tournament.rank || '',
      MatchFormat: ''
    };

    const set_scores = setScores(matchUp.set_scores);

    Object.assign(match_record, set_scores);

    return match_record;
  };

  fx.downloadITFmatches = (tournament = { tournamentId: '' }, matches) => {
    const profile = env.org.abbr || 'Unknown';
    const pinid_map =
      (tournament &&
        tournament.players &&
        Object.assign({}, ...tournament.players.map((p) => ({ [p.id]: p.cropin })))) ||
      {};
    const match_records = fx.ITFmatchRecords({ matches, tournament, pinid_map });
    const csv = fx.json2csv(match_records);
    fx.downloadText(`ITF-${profile}-${tournament.tournamentId}.csv`, csv);
  };

  fx.ITFmatchRecords = ({ matches, tournament, pinid_map }) => {
    return matches.map((matchUp) => fx.ITFmatchRecord({ matchUp, tournament, pinid_map })).filter((r) => r);
  };
  // END ITF

  // UTR
  const zeroPad = (number) => (number.toString()[1] ? number : '0' + number);
  const normalID = (id) => normalizeDiacritics(id).toUpperCase();
  const dateFormatUTR = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return [zeroPad(date.getMonth() + 1), zeroPad(date.getDate()), date.getFullYear()].join('/');
  };

  fx.downloadITFplayers = ({ players }) => {
    const pjson = players.map((p) => ({
      PlayerID: p.cropin,
      PassportGivenName: p.first_name,
      PassportFamilyName: p.last_name,
      Gender: p.sex === 'W' ? 'F' : 'M',
      Nationality: ['N', 'n'].indexOf(p.foreign) >= 0 ? 'CRO' : 'INO',
      BirthDate: formatDate(p.birth),
      Email: p.emailAddress || '',
      'Postal Code': '',
      Source: 'CRM'
    }));
    const csv = fx.json2csv(pjson);
    fx.downloadText(`ITF-HTS-Players.csv`, csv);
  };

  function powerOfTwo(n) {
    if (isNaN(n)) return false;
    return n && (n & (n - 1)) === 0;
  }

  fx.UTRmatchRecord = (matchUp, tournament_players) => {
    const getPlayerBirth = (player) =>
      tournament_players.reduce((p, c) => p || (c.id === player.id ? c.birth : false), false) || '';
    const winners = matchUp.team_players[matchUp.winner];
    const losers = matchUp.team_players[1 - matchUp.winner];
    const players = matchUp.players;

    // abort if any players are null
    const two_four = powerOfTwo(matchUp.players.filter((f) => f).length);
    if (!two_four) {
      console.log('players error:', matchUp);
      return;
    }

    const dbls = winners && winners.length > 1;
    const category = matchUp.tournament.category;
    const genders = players
      .map((p) => p && p.sex)
      .filter((f) => f)
      .filter((item, i, s) => s.lastIndexOf(item) === i);
    const player_gender = (sex) => (['M', 'B'].indexOf(sex) >= 0 ? 'M' : 'F');
    const draw_gender = !genders.length ? '' : genders.length > 1 ? 'Mixed' : genders[0] === 'M' ? 'Male' : 'Female';
    if (!matchUp.round_name) console.log('no round name:', matchUp);
    const qualifying =
      matchUp.round_name && matchUp.round_name.indexOf('Q') === 0 && matchUp.round_name.indexOf('QF') < 0;
    const draw_type = matchUp.consolation ? 'Consolation' : qualifying ? 'Qualifying' : 'Main';

    const sanctioning = env.org?.name || '';

    const profileID = (profile_url) => {
      const parts = profile_url && typeof profile_url === 'string' && profile_url.split('/');
      return !parts || (parts.indexOf('myutr') < 0 && parts.indexOf('players') < 0) ? '' : parts.reverse()[0];
    };

    if (!winners) {
      console.log('matchUp:', matchUp);
      return;
    }

    const schedule_date = matchUp.schedule && matchUp.schedule.day && new Date(matchUp.schedule.day);
    const match_date =
      schedule_date && schedule_date <= matchUp.tournament.endDate
        ? schedule_date
        : matchUp.date > matchUp.tournament.endDate
        ? matchUp.tournament.endDate
        : matchUp.date;

    return {
      Date: dateFormatUTR(match_date),

      'Winner 1 Name': normalizeName(`${players[winners[0]].last_name}, ${players[winners[0]].first_name}`),
      'Winner 1 Third Party ID': normalID(players[winners[0]].cropin || ''),
      'Winner 1 UTR ID': profileID(players[winners[0]].profile),
      'Winner 1 Gender': player_gender(players[winners[0]].sex),
      'Winner 1 DOB': dateFormatUTR(getPlayerBirth(players[winners[0]])),
      'Winner 1 City': normalizeDiacritics(players[winners[0]].city || ''),
      'Winner 1 State': '',
      'Winner 1 Country': players[winners[0]].ioc || '',
      'Winner 1 College': '',
      'Winner 2 Name': dbls ? normalizeName(`${players[winners[1]].last_name}, ${players[winners[1]].first_name}`) : '',
      'Winner 2 Third Party ID': normalID(dbls ? players[winners[1]].cropin || '' : ''),
      'Winner 2 UTR ID': profileID(players[winners[1]] && players[winners[1]].profile),
      'Winner 2 Gender': dbls ? player_gender(players[winners[1]].sex) : '',
      'Winner 2 DOB': dbls ? dateFormatUTR(getPlayerBirth(players[winners[1]])) : '',
      'Winner 2 City': normalizeDiacritics(dbls ? players[winners[0]].city || '' : ''),
      'Winner 2 State': '',
      'Winner 2 Country': dbls ? players[winners[1]].ioc || '' : '',
      'Winner 2 College': '',

      'Loser 1 Name': normalizeName(`${players[losers[0]].last_name}, ${players[losers[0]].first_name}`),
      'Loser 1 Third Party ID': normalID(players[losers[0]].cropin || ''),
      'Loser 1 UTR ID': profileID(players[losers[0]].profile),
      'Loser 1 Gender': player_gender(players[losers[0]].sex),
      'Loser 1 DOB': dateFormatUTR(getPlayerBirth(players[losers[0]])),
      'Loser 1 City': normalizeDiacritics(players[losers[0]].city || ''),
      'Loser 1 State': '',
      'Loser 1 Country': players[losers[0]].ioc || '',
      'Loser 1 College': '',
      'Loser 2 Name': dbls ? normalizeName(`${players[losers[1]].last_name}, ${players[losers[1]].first_name}`) : '',
      'Loser 2 Third Party ID': normalID(dbls ? players[losers[1]].cropin || '' : ''),
      'Loser 2 UTR ID': profileID(players[losers[1]] && players[losers[1]].profile),
      'Loser 2 Gender': dbls ? player_gender(players[losers[1]].sex) : '',
      'Loser 2 DOB': dbls ? dateFormatUTR(getPlayerBirth(players[losers[1]])) : '',
      'Loser 2 City': normalizeDiacritics(dbls ? players[losers[0]].city || '' : ''),
      'Loser 2 State': '',
      'Loser 2 Country': dbls ? players[losers[1]].ioc || '' : '',
      'Loser 2 College': '',

      Score: matchUp.score,
      'Id Type': 'UTR',
      'Draw Name': matchUp.tournament.draw || '',
      'Draw Gender': draw_gender,
      'Draw Team Type': normalizeName(matchUp.format) || '',
      'Draw Bracket Type': '',
      'Draw Bracket Value': category,
      'Draw Type': draw_type,
      'Tournament Name': matchUp.tournament.name || '',
      'Tournament URL': '',
      'Tournament Start Date': dateFormatUTR(new Date(matchUp.tournament.startDate).getTime()),
      'Tournament End Date': dateFormatUTR(new Date(matchUp.tournament.endDate).getTime()),
      'Tournament City': '',
      'Tournament State': '',
      'Tournament Country': '',
      'Tournament Country Code': '',
      'Tournament Host': '',
      'Tournament Location Type': '',
      'Tournament Surface': '',
      'Tournament Event Type': 'Tournament',
      'Tournament Event Category': category === 'Seniors' || category === 'S' ? 'Seniors' : 'Juniors',
      'Tournament Import Source': 'CourtHive',
      'Tournament Sanction Body': sanctioning,
      'Match ID': matchUp.muid,
      'Tournament Event Grade': ''
    };
  };

  fx.downloadUTRmatches = (tournament, matches) => {
    const profile = env.org.abbr || 'Unknown';
    const match_records = fx.UTRmatchRecords({ matches, players: tournament.players });
    const csv = fx.json2csv(match_records);
    const category = tournament.category ? `-U${tournament.category}` : '';
    fx.downloadText(`UTR-${profile}-${tournament.tournamentId}${category}.csv`, csv);
  };

  fx.UTRmatchRecords = ({ matches, players }) => {
    return matches.map((m) => fx.UTRmatchRecord(m, players)).filter((r) => r);
  };

  // END UTR

  return fx;
})();
