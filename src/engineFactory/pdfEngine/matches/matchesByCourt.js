/*
import { env } from 'config/defaults';
import { localizeDate } from 'engines/pdfEngine/primitives';
import {
   matchTime, matchDesignator, matchRound, matchScore,
   teamBlock
} from 'engines/pdfEngine/matches/matchPrimitives';

import { matchesListPageHeader } from 'engines/pdfEngine/headers/matchesListHeader';
*/

export function matchesByCourt({ tournament = {}, team, type, matches, logo }) {
  /*
  // MATCH FORMATS
  function byCourtRow(matchUp) {
     return [
        matchTime(matchUp, env),
        matchDesignator({ tournament, matchUp }),
        matchRound(matchUp),
        teamBlock({ matchUp, side: 'left' }),
        teamBlock({ matchUp, side: 'right' }),
        matchScore(matchUp)
     ]
  }

  let matches_by_court_widths = [ 45, 45, 25, '*', '*', 50 ];

  let courts = matches.reduce((p, c) => p.indexOf(c.schedule.court) < 0 ? p.concat(c.schedule.court) : p, []);
  let filtered_by_court = Object.assign({}, ...courts.map(court => ({ [court]: matches.filter(matchUp => matchUp.schedule.court === court) }) ));

  let courts_and_days = Object.assign({}, ...courts.map(court => {
     let court_matches = filtered_by_court[court];
     let days = matches.reduce((p, c) => p.indexOf(c.schedule.day) < 0 ? p.concat(c.schedule.day) : p, []);
     return { [court]: Object.assign({}, ...days.map(day => ({ [day]: dayByTime(court_matches) }) )) };
  }));

  function dayByTime(matches) {
     let times = matches.reduce((p, c) => p.indexOf(c.schedule.time) < 0 ? p.concat(c.schedule.time) : p, []).sort(timeSort).sort(nullSort);
     return Object.assign({}, ...times.map(time => ({ [time]: matches.filter(matchUp => matchUp.schedule.time === time) }) ))
  }

  function nullSort(a, b) {
     if (a === b) return 0;
     if (!a) return 1;
     if (!b) return -1;
     return 0;
  }

  let court_blocks = Object.keys(courts_and_days).sort().map(court => {
     let elements = [{ text: court, style: 'courtHeader' }];
     Object.keys(courts_and_days[court]).sort().forEach(day => {
        elements.push({ text: localizeDate(offsetDate(day)), style: 'dayHeader' });

        Object.keys(courts_and_days[court][day]).forEach(time => {
           let matches = courts_and_days[court][day][time];
           let formatted_matches = matches.map(byCourtRow);
           let match_block = {
              style: 'matchRows',
              table: {
                 headerRows: 0,
                 widths: matches_by_court_widths,
                 body: formatted_matches
              },
              layout: 'headerLineOnly'
           };
           elements.push(match_block);

        });
     });
     return elements;
  });

  let page_header = matchesListPageHeader({ tournament, team, type, logo });
  let bodycontent = [ court_blocks ];
  let content = [page_header, bodycontent];

  var docDefinition = {
     pageSize: env.printing.pageSize,
     pageOrientation: 'portrait',
     pageMargins: [ 10, 20, 10, 10 ],

     content,
     styles: {
        dayHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 8]},
        matchRows: { bold: false, fontSize: 10, color: 'black' },
        courtHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 8]},
        timeHeader: { fontSize: 11, bold: true, margin: [0, 0, 0, 8]},
        matchHeader: { fontSize: 11, bold: true }
     }
  };

  return { docDefinition };
  */
}
