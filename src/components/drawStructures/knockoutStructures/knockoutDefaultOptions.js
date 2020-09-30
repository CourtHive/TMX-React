export function knockoutDefaultOptions() {
  return {
    selector: undefined,

    cleanup: true, sizeToFit: false, width: undefined, height: undefined,
    minWidth: undefined, minHeight: 100, minPlayerHeight: 40, maxPlayerHeight: 60,

    invert_first: false, invert_threshold: 200, 
    draw: { feed_in: false },

    lines: { stroke_width: 1 },
    roundBar: {
       display: true,
       stroke: 2,
       offset: 60,
       fontSize: 14
    },
    seeds: { color: '#000', limit: undefined },
    text: { bye: 'BYE', qualifier: 'Qualifier', title: '' },
    flags: { display: true, threshold: 140 },
    edit_fields: { display: true, color: 'gray', highlight_color: 'blue', opacity: .2 },

    schedule: {
       times: true, military: false, dates: true,
       after: false, courts: true, identifiers: true
    },

    margins: { top: 20, left: 0, right: 0, bottom: 20 }, 
    details: {
       drawPositions: true, playerRankings: false, playerRatings: false,
       drawEntry: false, seeding: true, teams: true, },

    detail_attr: { font_size: 10, seeding_font_size: 12 },
    detail_offsets: { base: 20, width: 20, first_round: 30 },
    team: { offset: -2 },
    players: { offset_left: 3, offset_singles: -5, offset_score: 2, offset_doubles: -20 },
    teams: { length_divisor: 3, hover_color: 'blue', threshold: 140 }, 
    names: {
       length_divisor: 9, max_font_size: 14, min_font_size: 10, seed_number: true,
       seed_block: false, boldSeeds: true, first_initial: false
    },
    scores: { max_font_size: 14, min_font_size: 10 },
    umpires: { display: true, offset: 15, color: '#777777' },
    matchdates: {
       display: true, offset: -14, color: 'blue', start_monday: false, weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
       monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    }
  };
}

export function keyWalk(valuesObject, optionsObject) {
   if (!valuesObject || !optionsObject) return;
   var vKeys = Object.keys(valuesObject);
   var oKeys = Object.keys(optionsObject);
   for (var k=0; k < vKeys.length; k++) {
      if (oKeys.indexOf(vKeys[k]) >= 0) {
         var oo = optionsObject[vKeys[k]];
         var vo = valuesObject[vKeys[k]];
         if (oo && typeof oo === 'object' && typeof vo !== 'function' && oo.constructor !== Array) {
               keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
         } else {
               optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
         }
      }
   }
}