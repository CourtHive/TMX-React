import i18n from 'i18next';
import { localizeDate } from 'engineFactory/pdfEngine/primitives';
import { offsetDate } from 'competitionFactory/utilities/dateTime';

export function schedulePageFooter(tournament, day) {
  const schedule_published = tournament.schedule && tournament.schedule.published;
  const pub_date = schedule_published ? offsetDate(schedule_published) : new Date();
  const timestamp = localizeDate(pub_date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let umpirenotes = tournament.schedule && tournament.schedule.umpirenotes;
  if (tournament.schedule && tournament.schedule.notes && tournament.schedule.notes[day])
    umpirenotes = tournament.schedule.notes[day];

  const footer = {
    margin: [10, 0, 10, 0],
    fontSize: 8,
    style: 'tableExample',
    table: {
      widths: ['*', 80, 130],
      body: [
        [
          { text: i18n.t('phrases.oop_system') },
          { text: i18n.t('phrases.schedulepublished') },
          { text: i18n.t('phrases.judgesignature') }
        ],
        [{ text: umpirenotes || ' ', fontSize: 9 }, [{ text: timestamp }, { text: ' ' }], { text: ' ' }]
      ]
    },
    layout: {
      defaultBorder: true
    }
  };
  return footer;
}
