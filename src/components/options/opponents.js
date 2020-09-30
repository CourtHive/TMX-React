import i18n from "i18next";

export function teamOptionNames({ teams, designator, drawDefinition }) {
    let upperName = (opponent) => (opponent.name && opponent.name.toUpperCase()) || (opponent.last_name && opponent.last_name.toUpperCase()) || '';
    let orderSort = (a, b) => a.order - b.order;

    let option_names = teams.sort(orderSort).map(team => {
        let seed = team[0].seed && !designator ? ` [${team[0].seed}]` : '';

        let draw_order = seed ? '' : team.order && !designator ? ` (${team.order})` : '';

        let info = designator ? ` [${designator}]` : '';
        if (team.length === 1) {
        let option_text = opponentName({ opponent: team[0], designator, drawDefinition });
        if (team[0].otherName) { option_text += ` (${team[0].otherName})`; }
        return option_text;
        }
        return `${upperName(team[0])}/${upperName(team[1])}${seed || draw_order}${info}`;
    });

    return option_names;
}

export function opponentName({ opponent, designator, length_threshold }) {
    if (!opponent) return '';
    if (opponent.bye) return i18n.t('bye');
    if (opponent.qualifier && !opponent.last_name) return i18n.t('qualifier');
    length_threshold = length_threshold || 30;

    let seed = opponent.seed && !designator ? ` [${opponent.seed}]` : '';
    let draw_order = seed ? '' : opponent.draw_order && !designator ? ` (${opponent.draw_order})` : '';
    let info = designator ? ` [${designator}]` : '';
    let opponent_rating = opponent.rating ? ` {${opponent.rating}}` : '';

    let text;
    if (opponent.name) {
        text = `${uCase(opponent.name)}${seed}${draw_order}${info}`;
        if (text.length > length_threshold && opponent.abbr) text = `${uCase(opponent.abbr)}${seed}${draw_order}${info}`;
    } else {
        let first_initial = opponent.first_name ? `, ${opponent.first_name[0]}` : '';
        let first_name = opponent.first_name ? `, ${opponent.first_name}` : '';
        let first_first_name = opponent.first_name && opponent.first_name.split(' ').length > 1 ? `, ${opponent.first_name.split(' ')[0]}` : first_name;
        let last_last_name = opponent.last_name && opponent.last_name.trim().split(' ').length > 1 ? opponent.last_name.trim().split(' ').reverse()[0] : opponent.last_name;
        let last_name = opponent.last_name ? opponent.last_name : '';
        let last_first_i = `${uCase(last_name)}${first_initial || ''}${seed}${draw_order}${info}`;
        let last_last_i = `${uCase(last_last_name)}${first_initial || ''}${seed}${draw_order}${info}`;

        text = `${uCase(last_name)}${first_name}${seed}${draw_order}${info}`;
        if (text.length > length_threshold) text = `${uCase(last_name)}${first_first_name}${seed}${draw_order}${info}`;
        if (text.length > length_threshold) text = last_first_i;
        if (text.length > length_threshold) text = last_last_i;
        if (opponent.otherName && opponent.otherName <= length_threshold) text = opponent.otherName;
    }

    return `${text}${opponent_rating}`;

    function uCase(name) { return (name && name.toUpperCase()) || ''; }
}