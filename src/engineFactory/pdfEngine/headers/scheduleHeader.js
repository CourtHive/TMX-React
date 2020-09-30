import { offsetDate, ymd2date } from 'competitionFactory/utilities/dateTime';
import i18n from 'i18next';
import { localizeDate } from 'engineFactory/pdfEngine/primitives';
import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

export function schedulePageHeader(tournament, day, logo) {
  const tournamentId = tournament?.unifiedTournamentId?.tournamentId || tournament?.tournamentId;
  const tournament_id = tournament.display_id || (tournamentId.length < 15 ? tournamentId : '');

  const daysdate = ymd2date(day);
  const weekday = localizeDate(daysdate, { weekday: 'long' });
  const numeric_date = localizeDate(daysdate, { year: 'numeric', month: 'numeric', day: 'numeric' });
  const start_date = localizeDate(offsetDate(tournament.startDate), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  const tournament_name = `${tournament.name}${sponsor}`;

  let header_notice = (tournament.schedule && tournament.schedule.notice) || '';
  if (tournament.schedule && tournament.schedule.notices && tournament.schedule.notices[day])
    header_notice = tournament.schedule.notices[day];

  const schedule = {
    margin: [20, 10, 20, 10],
    fontSize: 10,
    table: {
      widths: ['*', '*', '*', '*', '*', 'auto'],
      body: [
        [
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [
                [{ text: tournament_name || ' ', colSpan: 5, style: 'docTitle', margin: [0, 0, 0, 0] }, {}, {}, {}, {}],
                [
                  { text: i18n.t('signin.tournament_date'), style: 'tableHeader', margin: [0, 0, 5, 0] },
                  { text: i18n.t('schedule.orderofplay'), colSpan: 2, style: 'docName', margin: [0, 0, 0, 0] },
                  {},
                  {
                    stack: [{ text: weekday }, { text: numeric_date }],
                    rowSpan: 2,
                    style: 'docName',
                    margin: [0, 0, 0, 0],
                    border: [true, true, true, true]
                  },
                  {}
                ],
                [{ text: start_date, style: 'tableData' }, {}, {}, {}, {}]
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
          { text: i18n.t('signin.id'), style: 'tableHeader', margin: [0, 0, 5, 0] },
          { text: i18n.t('signin.organization'), style: 'tableHeader', margin: [0, 0, 5, 0] },
          {},
          {},
          {},
          { text: i18n.t('signin.judge'), style: 'tableHeader', alignment: 'right' }
        ],
        [
          { text: tournament_id, style: 'tableData' },
          { text: tournament.organization || '', style: 'tableData' },
          { colSpan: 3, text: header_notice, style: 'headerNotice' },
          {},
          {},
          { text: tournament.judge || '', style: 'tableDatat', alignment: 'right' }
        ]
      ]
    },
    layout: noPaddingOrBorder,
    margins: [10, 0, 10, 0]
  };

  return schedule;
}
