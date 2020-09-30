import { reverseStringScore } from './reverseStringScore';
import { matchUpFormatCode } from './matchUpFormatCode';

export function convertStringScore({ string_score, winner_index, split=' ', matchUpFormat }) {
  if (!string_score) return [];

  string_score = winner_index ? reverseStringScore(string_score) : string_score;

  let outcome = null;
  let ss = /(\d+)/;
  let sst = /(\d+)\((\d+)\)/;
  let match_format = matchUpFormatCode.parse(matchUpFormat);

  let sets = string_score.split(split).filter(f=>f).map(set => {

     if (set.indexOf('/') > 0) {
        // look for supertiebreak scores using #/# format
        let scores = set.split('/').map(m => (ss.exec(m)) ? { games: +ss.exec(m)[1] } : undefined).filter(f=>f);
        if (scores.length === 2) return scores;
     }

     // uglifier doesn't work if variable is undefined
     let tbscore = null;
     let scores = set.split('-')
        .map(m => {
           let score;
           if (sst.test(m)) {
              tbscore = +sst.exec(m)[2];
              score = { games: +sst.exec(m)[1] };
           } else if (ss.test(m)) {
              score = { games: +ss.exec(m)[1] };
           } else {
              outcome = m;
           }
           return score || undefined;
        });

     // filter out undefined scores
     scores = scores.filter(f=>f);

     // add spacer for score without tiebreak score
     if (tbscore !== null) {
        let min_games = Math.min(...scores.map(s=>s.games));
        scores.forEach(sf => { if (+sf.games === +min_games) { sf.tiebreak = tbscore; } else { sf.spacer = tbscore; } });
     }

     return scores;
  });
 
  // filter out sets without two scores
  sets = sets.filter(scores => scores && scores.length === 2);

  // determine if set is supertiebreak
  sets.forEach((st, i) => {
     let set_format = match_format && (match_format.finalSetFormat || match_format.setFormat);
     let supertiebreak_to = set_format && set_format.tiebreakSet && set_format.tiebreakSet.tiebreakTo;

     if (st[0].games >= supertiebreak_to || st[1].games >= supertiebreak_to) { 
        st[0].supertiebreak = st[0].games; 
        st[1].supertiebreak = st[1].games;
        delete st[0].games;
        delete st[1].games;
     } 
  });

  if (winner_index !== undefined) { sets.winner_index = winner_index; }

  if (outcome) {
     if (outcome === 'Cancelled') sets.cancelled = true;
     if (outcome === 'Abandoned') sets.abandoned = true;
     if (outcome === 'INC.') sets.incomplete = true;
     if (outcome === 'INT.') sets.interrupted = true;
     if (outcome === 'LIVE') sets.live = true;
     if (outcome === 'TIME') sets.time = true;
     if (outcome === 'DEF.') sets.default = true;
     if (outcome === 'W.O.') sets.walkover = true;

     if (!sets.length) return sets;

     // passing additional detail from string parse...
     if (winner_index !== undefined) {
        // outcomes are attributed to loser...
        sets[sets.length - 1][1 - winner_index].outcome = outcome;
        // and set as attribute on set
        sets[sets.length - 1].outcome = outcome;
        sets.outome = outcome;
     }
  }

  return sets;
}
