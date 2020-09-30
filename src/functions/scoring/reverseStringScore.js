
export function reverseStringScore(score, split=' ') {
    let irreversible = null;
    if (score) {
        let reversed = score.split(split).map(parseSet).join(split);
        let result = (irreversible) ? `${irreversible} ${reversed}` : reversed;
        return result;
    }

    function parseSet(set) {
        let divider = set.indexOf('/') > 0 ? '/' : '-';
        let set_scores = set.split(divider).map(parseSetScore).reverse().filter(f=>f);
        let set_games = set_scores.map(s=>s.games);
        let tb_scores = set_scores.map(s=>s.tiebreak).filter(f=>f);
        let tiebreak = tb_scores.length === 1 ? `(${tb_scores[0]})` : '';
        let set_score = tb_scores.length < 2 ? set_games.join(divider) : set_games.map((s, i) => `${s}(${tb_scores[i]})`).join(divider);
        return `${set_score}${tiebreak}`;
    }

    function parseSetScore(set) {
        let ss = /(\d+)/;
        let sst = /(\d+)\((\d+)\)/;
        if (sst.test(set)) return { games: sst.exec(set)[1], tiebreak: sst.exec(set)[2] };
        if (ss.test(set)) return { games: ss.exec(set)[1] };
        irreversible = set;
        return undefined;
    }
}