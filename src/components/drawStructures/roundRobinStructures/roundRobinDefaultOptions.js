export function roundRobinDefaultOptions() {
   return {
      id: 'rrDraw',
      selector: undefined,
      qualifying: false,

      width: undefined,
      min_width: 1000,
      ref_width_selector: 'body',
      ref_width_factor: .9,

      height: undefined,
      min_height: 200,
      minPlayerHeight: 25,

      labels: { group: 'GROUP' },
      brackets: { size: 4 },

      matchUpFormat: 'SET3-S:6/TB7',

      player_cells: {
         color: 'white',
         highlight_color: 'lightgray'
      },

      score_cells: {
         color: 'white',
         walkover: 'black',
         live_color: '#A9F5A9',
         highlight_color: 'lightblue'
      },

      margins: { top: 6, left: 10, right: 10, bottom: 0 },
      seeds: { color: '#000', limit: undefined },
      scores: { max_font_size: 14, min_font_size: 10 },
      bracket: { positions: 4, initial_position: 1 },
      
      names: { first_initial: false, length_divisor: 9, max_font_size: 14, min_font_size: 10 },

      details: {
         drawPositions: true,
         player_rankings: true,
         player_ratings: 'utr',
         draw_entry: true,
         seeding: true,
         won_lost: true,
         games_won_lost: false,
         bracket_order: true
      },
      sizeToFit: false
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