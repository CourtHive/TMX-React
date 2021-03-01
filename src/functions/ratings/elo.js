export const eloRatings = (function () {
  let elo = {
    range: [0, 3000],
    default: 1500,
    nSpread: 400, // determines the 'spread' of the scale
    kCalc: k538, // use calculation defined by FiveThirtyEight.com
    kMultiplier: kSet, // change to kDefault for value of 1
    diffThreshold: 0.125
  };

  let ratings = {
    elo: { range: [0, 3000], decimals: 0, default: 1500 },
    wtn: { range: [0, 40], decimals: 0, default: 8 },
    'wtn-d': { range: [0, 40], decimals: 0, default: 8 },
    wtnd: { range: [0, 40], decimals: 0, default: 8 },
    utr: { range: [1, 16], decimals: 2, default: 6 },
    'utr-d': { range: [1, 16], decimals: 2, default: 6 },
    utrd: { range: [1, 16], decimals: 2, default: 6 },
    ntrp: { range: [1, 7], decimals: 1, default: 3 }
  };

  elo.expect = (player_rating, opponent_rating) => {
    return 1 / (1 + Math.pow(10, (opponent_rating - player_rating) / elo.nSpread));
  };

  elo.defaultRating = ({ rating_type }) => (rating_type && ratings[rating_type] && ratings[rating_type].default) || 0;
  elo.ratingDelta = ({ rating, rating_type, delta }) => {
    let decimal_places = (rating_type && ratings[rating_type] && ratings[rating_type].decimals) || 0;
    let new_rating = (parseFloat(rating) + parseFloat(delta)).toFixed(decimal_places);
    if (new_rating < 0) new_rating = rating;
    return new_rating;
  };

  elo.newRating = ({
    sets,
    max_sets,
    rating_type = 'elo',
    rating_range = elo.range,
    winner_rating = elo.default,
    winner_count = 1,
    loser_rating = elo.default,
    loser_count = 0
  } = {}) => {
    if (rating_type && ratings[rating_type]) rating_range = ratings[rating_type].range;
    if (winner_rating <= 16 && loser_rating <= 16 && rating_range[1] > 16) {
      rating_type = 'utr';
      rating_range = ratings[rating_type].range;
      console.log('auto-switching to UTR');
    } else if (winner_rating <= 50 && loser_rating <= 50 && rating_range[1] > 50) {
      rating_type = 'wtn';
      rating_range = ratings[rating_type].range;
      console.log('auto-switching to WTN');
    }
    let decimal_places = (rating_type && ratings[rating_type] && ratings[rating_type].decimals) || 0;

    if (!inRange(rating_range, winner_rating) || !inRange(rating_range, loser_rating)) {
      if (!inRange(rating_range, winner_rating)) winner_rating = ratings[rating_type].default;
      if (!inRange(rating_range, loser_rating)) loser_rating = ratings[rating_type].default;
    }

    let w_rating = convertRange({ value: winner_rating, existing_range: rating_range, target_range: elo.range });
    let l_rating = convertRange({ value: loser_rating, existing_range: rating_range, target_range: elo.range });
    let w_expect = elo.expect(w_rating, l_rating);
    let l_expect = elo.expect(l_rating, w_rating);
    let w_kValue = elo.kCalc(winner_count);
    let l_kValue = elo.kCalc(loser_count);
    let k = elo.kMultiplier(max_sets, sets);
    let w_new_rating = w_rating + k * w_kValue * (1 - w_expect);
    let l_new_rating = l_rating + k * l_kValue * (0 - l_expect);
    let winner_converted_rating = convertRange({
      value: w_new_rating,
      existing_range: elo.range,
      target_range: rating_range
    });
    let loser_converted_rating = convertRange({
      value: l_new_rating,
      existing_range: elo.range,
      target_range: rating_range
    });

    let winner_new_rating = parseFloat(winner_converted_rating).toFixed(decimal_places);
    let loser_new_rating = parseFloat(loser_converted_rating).toFixed(decimal_places);

    //  if expected winner && pct_diff > threshold don't change ratings
    let pct_diff = rating_range[1] ? Math.abs(winner_rating - loser_rating) / rating_range[1] : 0;
    if (
      (winner_rating > loser_rating && pct_diff > elo.diffThreshold) ||
      winner_new_rating < 0 ||
      loser_new_rating < 0
    ) {
      winner_new_rating = winner_rating;
      loser_new_rating = loser_rating;
    }

    return { winner_new_rating, loser_new_rating };
  };

  function inRange(range, value) {
    return value >= range[0] && value <= range[1];
  }

  // see footnote #3 here:
  // http://fivethirtyeight.com/features/serena-williams-and-the-difference-between-all-time-great-and-greatest-of-all-time/
  function k538(matchUps) {
    return 250 / Math.pow(matchUps + 5, 0.4);
  }

  function kDefault() {
    return 1;
  }

  // win multipier is scaled by % sets won
  // https://www.stat.berkeley.edu/~aldous/157/Old_Projects/huang.pdf
  function kSet(max_sets = 3, played_sets = 2) {
    let kset = max_sets / played_sets;
    return isNaN(kset) ? kDefault() : kset;
  }

  function convertRange({ value, existing_range, target_range }) {
    return (
      ((value - existing_range[0]) * (target_range[1] - target_range[0])) / (existing_range[1] - existing_range[0]) +
      target_range[0]
    );
  }
  return elo;
})();
