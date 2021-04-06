import { env } from 'config/defaults';
import { noPadding, noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';
import { scheduleCell } from 'engineFactory/pdfEngine/schedule/scheduleCell';
import { schedulePageHeader } from 'engineFactory/pdfEngine/headers/scheduleHeader';
import { schedulePageFooter } from 'engineFactory/pdfEngine/footers/scheduleFooter';
import { utilities } from 'tods-competition-factory';

export function scheduleDocDefinition({ tournament, day, courts, matches, landscape, logo }) {
  let pageOrientation = courts.length < 5 && !landscape ? 'portrait' : 'landscape';
  let portrait = pageOrientation === 'portrait';

  let rounds = utilities.unique(matches.map((m) => parseInt(m.schedule.oop_round)));
  let max_round = Math.max(2, ...rounds);
  let row_matches = utilities
    .generateRange(1, max_round + 1)
    .map((oop_round) => matches.filter((m) => m.schedule.oop_round === oop_round))
    .filter((row) => row.length);

  let minimum_columns = courts.length < 5 && portrait ? 1 : 8;
  let column_headers = [...Array(Math.max(minimum_columns, courts.length))].map(() => '');
  let column_court_luids = [...Array(Math.max(minimum_columns, courts.length))].map(() => '');
  courts.forEach((court, i) => {
    let court_header = env.schedule.court_identifiers
      ? court.name || ''
      : (court.name && court.name.split(' ')[0]) || '';
    column_headers[i] = court_header;
    column_court_luids[i] = `${court.luid}${court.name}`;
  });

  let rows = row_matches.map((row, i) =>
    column_court_luids.map((cl) =>
      row_matches[i].reduce((p, m) => (`${m.schedule.luid}${m.schedule.court}` === cl ? m : p), {})
    )
  );

  let body = [[scheduleHeaderRow(column_headers)]].concat(rows.map((r, i) => [tableRow(i + 1, rows[i])]));

  let schedule_rows = {
    table: {
      widths: ['*'],
      headerRows: 1,
      body
    },
    layout: noPaddingOrBorder
  };

  let content = [schedule_rows];
  let team_font_size = portrait ? 10 : 8;
  let header_margin = env.printing.schedule.header ? 80 : 0;
  let footer_margin = env.printing.schedule.footer ? 50 : 0;

  let footer = !env.printing.schedule.footer ? '' : schedulePageFooter(tournament, day);
  var docDefinition = {
    pageSize: env.printing.pageSize,
    pageOrientation,

    pageMargins: [20, header_margin, 20, footer_margin],

    pageBreakBefore: function (currentNode) {
      return currentNode.id === 'noBreak' && currentNode.pageNumbers.length !== 1;
    },

    content,

    header: function (page) {
      if (page === 1) {
        return schedulePageHeader(tournament, day, logo);
      } else {
        return schedulePageHeader(tournament, day, logo);
      }
    },

    footer,

    styles: {
      docTitle: { fontSize: 12, bold: true },
      subtitle: { fontSize: 10, italics: true, bold: true },
      docName: { alignment: 'center', fontSize: 10, bold: true },
      tableHeader: { fontSize: 9 },
      tableData: { fontSize: 9, bold: true },
      headerNotice: { fontSize: 9, bold: true, italics: true, color: 'red' },
      teamName: { alignment: 'center', fontSize: team_font_size, bold: true },
      centeredText: { alignment: 'center', fontSize: 10, bold: false },
      centeredItalic: { alignment: 'center', fontSize: 9, bold: false, italics: true },
      centeredTableHeader: { alignment: 'center', fontSize: 9, bold: true },
      signatureBox: { border: true },
      centeredColumn: { alignment: 'center', border: true },
      italicCenteredColumn: { alignment: 'center', border: true, bold: true, italics: true }
    }
  };

  return { docDefinition };
}

function xRow(body, widths) {
  let row = {
    id: 'noBreak',
    table: {
      widths,
      body: [body]
    },
    layout: noPadding
  };
  return row;
}

function tableRow(i, cells) {
  let body = [{ stack: [scheduleCell({ oop: i })], width: 30 }].concat(...cells.map((c) => scheduleCell(c)));
  let widths = [30].concat(...cells.map(() => '*'));
  return xRow(body, widths);
}

function scheduleHeaderRow(court_names) {
  let body = [{ text: ' ', width: 30 }].concat(...court_names.map(headerCell));
  let widths = [30].concat(...court_names.map(() => '*'));
  return xRow(body, widths);
}

function headerCell(court_name) {
  let cell = {
    table: {
      widths: ['*'],
      body: [[{ text: court_name || ' ', style: 'centeredTableHeader', margin: [0, 0, 0, 0] }]]
    },
    layout: noPaddingOrBorder
  };
  return cell;
}
