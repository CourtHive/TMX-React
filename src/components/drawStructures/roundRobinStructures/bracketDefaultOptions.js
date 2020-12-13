export function bracketDefaultOptions() {
  return {
    selector: undefined,
    qualifying: undefined,
    bracket_name: undefined,
    bracketIndex: undefined,

    cleanup: true, // first remove all svg from root
    sizeToFit: true,
    width: undefined,
    height: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    minHeight: 300,
    minPlayerHeight: 25,

    labels: { group: 'GROUP' },
    seeds: { color: '#000', limit: undefined },
    margins: { top: 6, left: 10, right: 10, bottom: 0 },
    cells: {
      bye: '#fcf4ed',
      live: '#A9F5A9',
      invalid: 'lightgray',
      unfilled: '#EFFBEA'
    },

    names: {
      first_initial: false,
      length_divisor: 9,
      max_font_size: 14,
      min_font_size: 10
    },

    scores: { max_font_size: 14, min_font_size: 10 },
    bracket: { positions: 4, initial_position: 1 },

    score_cells: {
      color: 'white',
      walkover: 'black',
      live_color: '#A9F5A9',
      highlight_color: 'lightblue'
    },

    details: {
      teams: true,
      drawPositions: false,
      player_rankings: true,
      player_ratings: 'utr',
      draw_entry: false,
      seeding: false,
      won_lost: true,
      games_won_lost: false,
      bracket_order: true
    }
  };
}

export function keyWalk(valuesObject, optionsObject) {
  if (!valuesObject || !optionsObject) return;
  const vKeys = Object.keys(valuesObject);
  const oKeys = Object.keys(optionsObject);
  for (let k = 0; k < vKeys.length; k++) {
    if (oKeys.indexOf(vKeys[k]) >= 0) {
      const oo = optionsObject[vKeys[k]];
      const vo = valuesObject[vKeys[k]];
      if (oo && typeof oo === 'object' && typeof vo !== 'function' && oo.constructor !== Array) {
        keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
      } else {
        optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
      }
    }
  }
}
