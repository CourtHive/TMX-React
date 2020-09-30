import { env } from 'config/defaults';
import i18n from 'i18next';
import { normalizeName } from 'normalize-text';
import { formatDate } from 'competitionFactory/utilities/dateTime';
import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

export function signInSheet({
  tournament = {},
  players,
  gender,
  event_name = '',
  logo,
  doc_name = 'courthive',
  extra_pages = true,
  rowsPerPage,
  minimumEmpty
}) {
  const date = formatDate(tournament.startDate);
  const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;
  const tournament_id = tournament.display_id || (tournamentId.length < 15 ? tournamentId : '');

  const sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  const tournament_name = `${tournament.name}${sponsor}`;

  const page_header = [
    {
      border: [false, false, false, false],
      colSpan: 8,
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
    {}
  ];

  const dummy = [
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' },
    { border: [false, false, false, false], text: ' ' }
  ];

  const header_row = [
    { text: '#', style: 'centeredTableHeader' },
    { text: i18n.t('lnm'), style: 'tableHeader' },
    { text: i18n.t('fnm'), style: 'tableHeader' },
    { text: i18n.t('clb'), style: 'centeredTableHeader' },
    { text: i18n.t('prnk'), style: 'centeredTableHeader' },
    { text: i18n.t('stt'), style: 'centeredTableHeader' },
    { text: i18n.t('ord'), style: 'centeredTableHeader' },
    { text: i18n.t('signin.signature'), style: 'tableHeader' }
  ];

  const gendered_players = gender ? players.filter((f) => f.sex === gender) : players;
  const empty = (x) => Array.from({ length: x }, () => undefined);
  let empty_rows = rowsPerPage - (gendered_players.length % rowsPerPage);
  if (extra_pages && empty_rows < minimumEmpty) empty_rows += rowsPerPage;
  let rows = [].concat(...gendered_players, ...empty(empty_rows));

  rows = rows
    .map((row, i) => {
      if (row) {
        return [
          { text: i + 1, style: 'centeredColumn' },
          { text: row.last_name.toUpperCase().trim() },
          { text: normalizeName(row.first_name, false) },
          {
            text: row.club_code || row.country || ' ',
            style: row.club_code ? 'centeredColumn' : 'italicCenteredColumn'
          },
          { text: row.category_ranking || '', style: 'centeredColumn' },
          { text: ' ', style: 'centeredColumn' },
          { text: ' ', style: 'centeredColumn' },
          { text: ' ' }
        ];
      } else {
        return [{ text: i + 1, style: 'centeredColumn' }, ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      }
    })
    .filter((f) => f);

  const player_rows = [].concat([page_header], [dummy], [header_row], rows);
  const table_rows = {
    fontSize: 10,
    table: {
      headerRows: 3,
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 35, '*'],
      body: player_rows
    }
  };

  const docDefinition = {
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
