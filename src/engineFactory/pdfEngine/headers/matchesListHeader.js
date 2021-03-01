import { formatDate, offsetDate } from 'competitionFactory/utilities/dateTime';
import i18n from 'i18next';
import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

export function matchesListPageHeader({ tournament, team, logo }) {
  var sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  var tournament_name = `${tournament.name}${sponsor}`;
  var team_name = (team && team.name) || '';
  let team_header = (team_name && 'Team') || '';

  var draw_sheet = {
    fontSize: 10,
    table: {
      widths: ['*', '*', '*', '*', '*', 'auto'],
      headerRows: 2,
      body: [
        [
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [
                [{ text: tournament_name || ' ', colSpan: 5, style: 'docTitle', margin: [0, 0, 0, 0] }, {}, {}, {}, {}],
                [
                  { text: team_name, colSpan: 2, style: 'subtitle', margin: [0, 0, 0, 0] },
                  {},
                  { text: '', colSpan: 2, alignment: 'center', style: 'docName', margin: [0, 0, 0, 5] },
                  {},
                  {}
                ]
              ]
            },
            colSpan: 5,
            layout: noPaddingOrBorder
          },
          {},
          {},
          {},
          {},
          {
            width: 90,
            image: logo || '',
            alignment: 'center'
          }
        ],
        [
          { text: i18n.t('signin.tournament_date'), style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: i18n.t('signin.place'), style: 'tableHeader', margin: [0, 0, 5, 0] },
          {},
          { text: team_header, style: 'tableHeader', margin: [0, 0, 5, 0] },
          {},
          {}
        ],
        [
          { text: formatDate(offsetDate(tournament.startDate)), style: 'tableData' },
          { text: tournament.location || '', style: 'tableData' },
          {},
          { text: team_name || '', style: 'tableData' },
          {},
          {}
        ],
        [{ text: ' ', fontSize: 1, colSpan: 6, border: [false, false, false, true] }, {}, {}, {}, {}, {}]
      ]
    },
    layout: noPaddingOrBorder
  };

  return draw_sheet;
}
