/*
import { env } from 'config/defaults';
import { localizeDate } from 'engines/pdfEngine/primitives';
import {
   matchCourt, matchDesignator, matchRound, matchScore,
   teamBlock
} from 'engines/pdfEngine/matches/matchPrimitives';

import { matchesListPageHeader } from 'engines/pdfEngine/headers/matchesListHeader';
*/

export function matchesByTime({ tournament={}, team, type, matches, logo }) {
   /*
  // MATCH FORMATS
  function byTimeRow(matchUp) {
     return [
        matchCourt(matchUp),
        matchDesignator({ tournament, matchUp }),
        matchRound(matchUp),
        teamBlock({ matchUp, side: 'left' }),
        teamBlock({ matchUp, side: 'right' }),
        matchScore(matchUp)
     ]
  }

  let matches_by_time_widths = [ 40, 30, 25, '*', '*', 50 ];

  let days = matches.reduce((p, c) => p.indexOf(c.schedule.day) < 0 ? p.concat(c.schedule.day) : p, []);
  let filtered_by_day = Object.assign({}, ...days.map(day => ({ [day]: matches.filter(matchUp => matchUp.schedule.day === day) }) ));

  let days_and_times = Object.assign({}, ...days.map(day => {
     let day_matches = filtered_by_day[day];
     let times = day_matches.reduce((p, c) => p.indexOf(c.schedule.time) < 0 ? p.concat(c.schedule.time) : p, []);
     return { [day]: Object.assign({}, ...times.map(time => ({ [time]: day_matches.filter(matchUp => matchUp.schedule.time === time) }) )) };
  }));

  let times_blocks = Object.keys(days_and_times).sort().map(day => {
     let elements = [{ text: localizeDate(offsetDate(day)), style: 'dayHeader' }];
     Object.keys(days_and_times[day]).sort().forEach(time => {
        let time_text = time !== 'undefined' ? `Scheduled: ${time}` : 'Unscheduled';
        elements.push({text: time_text, style: 'timeHeader'});

        let matches = days_and_times[day][time];
        //  let formatted_matches = [matches_by_time_header].concat(matches.map(byTimeRow));
        let formatted_matches = matches.map(byTimeRow);
        let match_block = {
           style: 'matchRows',
           table: {
              headerRows: 0,
              widths: matches_by_time_widths,
              body: formatted_matches
           },
           layout: 'headerLineOnly'
        };
        elements.push(match_block);

     });

     return elements;
  });

  let page_header = matchesListPageHeader({ tournament, team, type, logo });
  let bodycontent = [ times_blocks ];
  let content = [page_header, bodycontent];

  var docDefinition = {
     pageSize: env.printing.pageSize,
     pageOrientation: 'portrait',
     pageMargins: [ 10, 20, 10, 10 ],

     content,
     styles: {
        matchRows: { bold: false, fontSize: 10, color: 'black' },
        dayHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 8]},
        timeHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 8]}
     }
  };

  return { docDefinition };
  */
}
