import { env } from 'config/defaults';
import i18n from 'i18next';
import { normalizeName } from 'normalize-text';
import { formatDate } from 'competitionFactory/utilities/dateTime';

import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

export function doublesSignInSheet({ tournament = {}, teams = [], event_name = '', logo, doc_name, rowsPerPage }) {
  let date = formatDate(tournament.startDate);
  let tournament_id = tournament.display_id || (tournament.tournamentId.length < 15 ? tournament.tournamentId : '');

  var sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  var tournament_name = `${tournament.name}${sponsor}`;

  let page_header = [
    {
      border: [false, false, false, false],
      colSpan: 9,
      table: {
        widths: ['auto', 'auto', '*', '*', '*', 'auto'],
        headerRows: 2,
        body: [
          [
            {
              table: {
                widths: ['*'],
                body: [[{ text: tournament_name || ' ', style: 'docTitle' }], [{ text: event_name, style: 'subtitle' }]]
              },
              colSpan: 5,
              layout: 'noBorders'
            },
            {},
            {},
            {},
            {},
            {
              width: 100,
              image: logo || '',
              alignment: 'center'
            }
          ],
          [{ text: doc_name || i18n.t('signin.doc_name'), colSpan: 6, style: 'docName', alignment: 'center' }],
          [{ text: i18n.t('signin.doc_subname'), colSpan: 6, style: 'docName', alignment: 'center' }],
          [
            { text: i18n.t('signin.tournament_date'), style: 'tableHeader' },
            { text: i18n.t('signin.organization'), style: 'tableHeader' },
            { text: i18n.t('signin.place'), style: 'tableHeader' },
            { text: '', style: 'tableHeader' },
            { text: '', style: 'tableHeader' },
            { text: i18n.t('signin.judge'), style: 'tableHeader' }
          ],
          [
            date,
            tournament.organization || ' ',
            tournament.location || '',
            '',
            '',
            { text: tournament.judge || ' ', margin: [0, 0, 0, 5] }
          ],
          [
            { text: i18n.t('signin.id'), style: 'tableHeader', margin: [0, 0, 5, 0] },
            { text: i18n.t('signin.rank'), style: 'tableHeader', margin: [0, 0, 5, 0] },
            { text: '', style: 'tableHeader' },
            { text: '', style: 'tableHeader' },
            { colSpan: 2, rowSpan: 2, text: ' ', border: [true, true, true, true] },
            { text: '', style: 'tableHeader' }
          ],
          [tournament_id, tournament.rank || ' ', ' ', '', '', '']
        ]
      },
      layout: noPaddingOrBorder
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
  ];

  let dummy = [
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' }
  ];

  let header_row = [
    { text: '#', style: 'centeredTableHeader' },
    { text: i18n.t('lnm'), style: 'tableHeader' },
    { text: i18n.t('fnm'), style: 'tableHeader' },
    { text: i18n.t('clb'), style: 'centeredTableHeader' },
    { text: i18n.t('prnk'), style: 'centeredTableHeader' },
    { text: i18n.t('lnm'), style: 'tableHeader' },
    { text: i18n.t('fnm'), style: 'tableHeader' },
    { text: i18n.t('clb'), style: 'centeredTableHeader' },
    { text: i18n.t('prnk'), style: 'centeredTableHeader' }
  ];

  let empty = (x) => Array.from({ length: x }, () => undefined);
  let empty_rows = rowsPerPage - (teams.length % rowsPerPage);
  let rows = teams.concat(...empty(empty_rows));

  rows = rows
    .map((row, i) => {
      if (row) {
        return [
          { text: i + 1, style: 'centeredColumn' },
          { text: row[0].last_name.toUpperCase().trim() },
          { text: normalizeName(row[0].first_name, false) },
          {
            text: row[0].club_code || row[0].country || ' ',
            style: row[0].club_code ? 'centeredColumn' : 'italicCenteredColumn'
          },
          { text: row[0].category_ranking || '', style: 'centeredColumn' },
          { text: row[1].last_name.toUpperCase().trim() },
          { text: normalizeName(row[1].first_name, false) },
          {
            text: row[1].club_code || row[1].country || ' ',
            style: row[1].club_code ? 'centeredColumn' : 'italicCenteredColumn'
          },
          { text: row[1].category_ranking || '', style: 'centeredColumn' }
        ];
      } else {
        return [{ text: i + 1, style: 'centeredColumn' }, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      }
    })
    .filter((f) => f);

  let player_rows = [].concat([page_header], [dummy], [header_row], rows);
  let table_rows = {
    fontSize: 10,
    table: {
      headerRows: 3,
      widths: ['auto', '*', '*', 'auto', 'auto', '*', '*', 'auto', 'auto'],
      body: player_rows
    }
  };

  var docDefinition = {
    pageSize: env.printing.pageSize,
    pageOrientation: 'portrait',

    content: [table_rows],

    styles: {
      docTitle: {
        fontSize: 16,
        bold: true
      },
      subtitle: {
        fontSize: 12,
        italics: true
      },
      docName: {
        fontSize: 14,
        bold: true
      },
      tableHeader: {
        fontSize: 11,
        bold: true
      },
      centeredTableHeader: {
        alignment: 'center',
        fontSize: 11,
        bold: true
      },
      signatureBox: {
        border: true
      },
      centeredColumn: {
        alignment: 'center',
        border: true
      },
      italicCenteredColumn: {
        alignment: 'center',
        border: true,
        bold: true,
        italics: true
      }
    }
  };

  return { docDefinition };
}
