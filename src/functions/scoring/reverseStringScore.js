export function reverseStringScore(score, split = ' ') {
  let irreversible = null;

  const parseSetScore = (set) => {
    const ss = /(\d+)/;
    const sst = /(\d+)\((\d+)\)/;
    if (sst.test(set)) return { games: sst.exec(set)[1], tiebreak: sst.exec(set)[2] };
    if (ss.test(set)) return { games: ss.exec(set)[1] };
    irreversible = set;
    return undefined;
  };

  const parseSet = (set) => {
    const divider = set.indexOf('/') > 0 ? '/' : '-';
    const setScores = set
      .split(divider)
      .map(parseSetScore)
      .reverse()
      .filter((f) => f);
    const setGames = setScores.map((s) => s.games);
    const tiebreakScores = setScores.map((s) => s.tiebreak).filter((f) => f);
    const tiebreak = tiebreakScores.length === 1 ? `(${tiebreakScores[0]})` : '';
    const setScore =
      tiebreakScores.length < 2
        ? setGames.join(divider)
        : setGames.map((s, i) => `${s}(${tiebreakScores[i]})`).join(divider);
    return `${setScore}${tiebreak}`;
  };

  if (score) {
    const reversed = score.split(split).map(parseSet).join(split);
    const result = irreversible ? `${irreversible} ${reversed}` : reversed;
    return result;
  }
}
