export function validRoundRobinGroupSize(opponents, size) {
  if (opponents === size) return true;
  if (opponents < size) return (size - opponents) === 1;
  let min_brackets = Math.ceil(opponents/size);
  let positions_with_max_byes = min_brackets * (size - 1);
  return positions_with_max_byes <= opponents;
}

export function nearestPow2(val) {
  return Math.pow(2, Math.round( Math.log(val) / Math.log(2)));
}