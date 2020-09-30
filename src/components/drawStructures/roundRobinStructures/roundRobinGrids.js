import { intersection } from 'functions/arrays';

function cellGridColumns(params) {
    return [{ 'attr': 'info', 'pct': 12 },  { 'attr': 'seed', 'pct': 4 }, { 'attr': 'player', 'pct': 20 }];
}

function textGridColumns(params) {
    return [
        { 'attr': 'draw_position', 'pct': 4 },  
        { 'attr': 'rank', 'pct': 4 },  
        { 'attr': 'entry', 'pct': 4 },  
        { 'attr': 'seed', 'pct': 4 }, 
        { 'attr': 'player', 'pct': 16 },
        { 'attr': 'participant', 'pct': 4 }
    ];
}

export function groupGrid(params) {
    let {textGrid, o, width=800, height=400, byes, xstart=0, y=0, participants, bracketData} = params;

    const matchUps = bracketData.matchUps || [];

    let columns = textGrid ? textGridColumns() : cellGridColumns();
    let data = [];
    let calc_height = height / (bracketData.positionsCount + 1);
    let rowHeight = (r) => r ? calc_height : calc_height * .8;
    let cw = (p) => width * p / 100;

    for (let mc=0; mc < bracketData.positionsCount; mc++) { columns.push({ 'attr': 'score', 'pct': 50 / bracketData.positionsCount, mc }); }

    let detail_count = Object.keys(o.details)
        .map(key => ['won_lost', 'games_won_lost', 'bracket_order'].indexOf(key) >= 0 && o.details[key])
        .filter(f=>f).length;
    let detail_pct = 14 / detail_count;
    if (o.details.won_lost) columns.push({ 'attr': 'result', 'pct': detail_pct });
    if (o.details.games_won_lost) columns.push({ 'attr': 'games', 'pct': detail_pct });
    if (o.details.bracket_order) columns.push({ 'attr': 'bracketOrder', 'pct': detail_pct });

    for (let row=0; row <= bracketData.positionsCount; row++) {
        data.push(mapColumns(xstart, row, columns));
        y += rowHeight(row);
    }
    return data;

    function matchUpTeams(cell) {
        const values= [cell.row-1, cell.mc-1];
        return participants.length && values.map(o=>participants[o]);
    }
    function gridTeam(cell) {
        if (participants[cell.row - 1]) return participants[cell.row - 1];
        if (cell.mc && participants[cell.mc - 1]) return participants[cell.mc - 1];
        return '';
    }
    function checkBye(cell) {
        if (byes[cell.row]) cell.bye = true;
        if (cell.mc && byes[cell.mc]) cell.bye = true;
    }
    function mapColumns(x, row, columns) {
        return columns.map((column, i) => {
            // attr definition handles special case: 1st row cells = player last names
            let attr = (!row && column.attr === 'score') ? 'player' : column.attr;
            let cell = { 
                attr, x, y,
                row, column: i,
                width: cw(column.pct),
                height: rowHeight(row),
                bracketIndex: bracketData.bracketIndex
            };
            if (!row && !i) { cell.group_name = o.bracket_name || `${o.labels.group} ${bracketData.bracketIndex + 1}`; }
            if (column.mc !== undefined) cell.mc = column.mc + 1;
            if (['player', 'result', 'games', 'bracketOrder'].includes(cell.attr)) {
                cell.participant = gridTeam(cell);
                if (row) {
                    cell.drawPosition = bracketData.initialBracketPosition + row - 1;
                    cell.structureId = bracketData.structureId;
                    cell.drawId = bracketData.drawId;
                }
            }
            if (cell.attr === 'player' && !cell.participant) checkBye(cell);
            if (cell.attr === 'score' && cell.row - 1 !== cell.mc - 1) {
                let cellTeams = matchUpTeams(cell);
                let drawPositions = cellTeams && cellTeams.filter(f=>f).map(t => t.drawPosition);
                cell.participants = cellTeams;
               
                let cellMatchUp = drawPositions && matchUps.reduce((p, c) => {
                    return (intersection(c.drawPositions || [], drawPositions).length === 2) ? c : p
                }, undefined);

                cell.matchUp = cellMatchUp;
                checkBye(cell);
            }
            x += cw(column.pct);
            return cell;
        });
    }
}