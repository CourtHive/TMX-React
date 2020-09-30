import i18n from 'i18next';
import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

import { utilities } from 'tods-competition-factory';
const { dateTime } = utilities;
const { offsetDate, formatDate } = dateTime;

export function drawSheetPageHeader(tournament, logo, type, selectedEvent, event) {
  const evt = event || (tournament.events && tournament.events[selectedEvent]) || { name: i18n.t('unk') };

  const event_type = 'event type';
  const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;
  const tournament_id = tournament.display_id || (tournamentId.length < 15 ? tournamentId : '');

  // let organizers = tournament.organizers && tournament.organizers !== tournament.name ? tournament.organizers : '';
  // let sponsor = tournament.sponsor || organizers ? ` - ${tournament.sponsor || organizers}` : '';
  const sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  const tournament_name = `${tournament.name}${sponsor}`;
  const category = evt.category ? `${evt.category} ` : '';
  const event_name = `${category}${evt.name}`;

  const header_start = (tournament.startDate && i18n.t('signin.tournament_date')) || '';
  const header_org = (tournament.organization && i18n.t('signin.organization')) || '';
  const header_location = (tournament.location && i18n.t('signin.place')) || '';
  const header_id = (tournament_id && i18n.t('signin.id')) || '';
  const header_rank = (tournament.rank && i18n.t('signin.rank')) || '';
  const header_judge = (tournament.judge && i18n.t('signin.judge')) || '';

  const draw_sheet = {
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
                  { text: event_name, colSpan: 2, style: 'subtitle', margin: [0, 0, 0, 0] },
                  {},
                  { text: event_type, colSpan: 2, alignment: 'center', style: 'docName', margin: [0, 0, 0, 5] },
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
          { text: header_start, style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: header_org, style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: header_location, style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: header_id, style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: header_rank, style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: header_judge, style: 'tableHeader', alignment: 'right' }
        ],
        [
          { text: formatDate(offsetDate(tournament.startDate)), style: 'tableData' },
          { text: tournament.organization || '', style: 'tableData' },
          { text: tournament.location || '', style: 'tableData' },
          { text: tournament_id, style: 'tableData' },
          { text: tournament.rank || '', style: 'tableData' },
          { text: tournament.judge || '', style: 'tableData', alignment: 'right' }
        ],
        [{ text: ' ', fontSize: 1, colSpan: 6, border: [false, false, false, true] }, {}, {}, {}, {}, {}]
      ]
    },
    layout: noPaddingOrBorder
  };

  return draw_sheet;
}
