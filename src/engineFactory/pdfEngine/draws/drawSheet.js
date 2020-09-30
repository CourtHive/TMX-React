import { env } from 'config/defaults';

import { fullName } from 'engineFactory/pdfEngine/primitives';
import { localizeDate } from 'engineFactory/pdfEngine/primitives';
import { drawSheetPageHeader } from 'engineFactory/pdfEngine/headers/drawSheetHeader';

import i18n from 'i18next';
import { utilities } from 'tods-competition-factory';
const { dateTime } = utilities;
const { isDate, offsetDate, formatDate } = dateTime;

export function drawSheet({ tournament = {}, images, logo, selectedEvent, event, info }) {
  const evt = event || (tournament.events && tournament.events[selectedEvent]);
  const player_representatives = (evt && evt.player_representatives) || [];
  const event_organizers = tournament && tournament.organizers ? [tournament.organizers] : [];
  const created = event.draw_created && isDate(event.draw_created) ? offsetDate(event.draw_created) : new Date();
  const timestamp = localizeDate(created, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const page_header = drawSheetPageHeader(tournament, logo, 'draw_sheet', selectedEvent, event);
  const { s1, s2, c1, c2, smin, smax, omin, omax, a1, c3, lda } = getRankedPlayers(evt, info);

  const date = offsetDate(tournament.startDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const rank_list_date = formatDate(`${year}-${month + 1}-01`);

  const footer = {
    margin: [10, 0, 10, 0],
    fontSize: 8,
    style: 'tableExample',
    table: {
      widths: [50, '*', 115, 'auto'],
      body: [
        [
          { text: i18n.t('rl'), bold: true },
          {
            columns: [
              { width: 10, text: '# ', bold: true },
              { width: '*', text: i18n.t('phrases.rankedplayers'), bold: true }
            ]
          },
          {
            columns: [
              { width: 10, text: '# ', bold: true },
              { width: '*', text: i18n.t('draws.substitutes'), bold: true }
            ]
          },
          { text: [i18n.t('phrases.timestamp'), timestamp], bold: true }
        ],
        [
          {
            fontSize: 6,
            stack: [
              { text: i18n.t('dt') },
              { text: rank_list_date, bold: true, alignment: 'center' },
              { text: ' ' },
              { text: i18n.t('draws.seedrange'), bold: true },
              {
                columns: [
                  { width: 35, stack: [{ text: `${i18n.t('draws.first')}:` }, { text: `${i18n.t('draws.last')}:` }] },
                  { width: 15, stack: [{ text: smin }, { text: smax }] }
                ]
              },
              { text: ' ' },
              { text: i18n.t('draws.playerrange'), bold: true },
              {
                columns: [
                  { width: 35, stack: [{ text: `${i18n.t('draws.first')}:` }, { text: `${i18n.t('draws.last')}:` }] },
                  { width: 15, stack: [{ text: omin }, { text: omax }] }
                ]
              }
            ]
          },
          {
            fontSize: 6,
            columns: [
              { width: 12, stack: c1 },
              { width: '*', stack: s1 },
              { width: 12, stack: c2 },
              { width: '*', stack: s2 }
            ]
          },
          {
            stack: [
              {
                columns: [
                  { width: 12, stack: c3 },
                  { width: '*', stack: a1 }
                ]
              },
              { text: ' ' },
              { text: i18n.t('draws.organizers'), bold: true, fontSize: 8 },
              { text: event_organizers[0] || ' ' },
              { text: event_organizers[1] || ' ' }
            ]
          },
          {
            stack: [
              { text: i18n.t('draws.lastdirectaccept'), bold: true, fontSize: 8 },
              lda,
              { text: ' ' },
              { text: i18n.t('draws.playerreps'), bold: true, fontSize: 8 },
              { text: player_representatives[0] || ' ' },
              { text: player_representatives[1] || ' ' },
              { text: ' ' },
              { text: i18n.t('phrases.judgesignature'), bold: true, fontSize: 8 },
              { text: ' ' },
              { text: ' ' }
            ]
          }
        ]
      ]
    },
    layout: {
      defaultBorder: true
    }
  };

  const body_images = images.map((image) => ({ image: image.src, width: (image.pct ? image.pct / 100 : 1) * 560 }));
  const content = [page_header, ' '].concat(body_images);

  const footer_margin = env.printing.drawsheets.footer && env.printing.pageSize !== 'LETTER' ? 120 : 0;

  const docDefinition = {
    pageSize: env.printing.pageSize,
    pageOrientation: 'portrait',

    pageMargins: [10, 20, 10, footer_margin],

    footer: env.printing.drawsheets.footer ? footer : '',

    content,
    styles: {
      docTitle: {
        fontSize: 11,
        bold: true
      },
      subtitle: {
        fontSize: 10,
        italics: true,
        bold: true
      },
      docName: {
        fontSize: 10,
        bold: true
      },
      tableHeader: {
        fontSize: 9
      },
      tableData: {
        fontSize: 9,
        bold: true
      },
      centeredTableHeader: {
        alignment: 'center',
        fontSize: 9,
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

function getRankedPlayers(evt, info) {
  const current_draw = evt.draw.compass ? evt.draw[evt.draw.compass] : evt.draw;
  const noevent = {
    s1: [],
    s2: [],
    c1: [],
    c2: [],
    smin: '',
    smax: '',
    omin: '',
    omax: '',
    a1: undefined,
    c3: undefined,
    lda: undefined
  };
  if (!current_draw || !current_draw.opponents) return noevent;
  // if (!info) info = drawInfo(current_draw);

  const blank = { text: ' ' };
  let lda = '';
  const a1 = new Array(6).fill(blank);
  const c3 = new Array(6).fill(blank);

  const seeded_players = current_draw.opponents.filter((o) => o[0].seed);
  const seed_rankings = [].concat(...seeded_players.map((p) => p.map((m) => m.category_ranking)));
  console.log('%c TODO: seed ranking not valid... no longer using category_ranking', 'color: red');
  const smin = seed_rankings.length ? Math.min(...seed_rankings) : '';
  const smax = seed_rankings.length ? Math.max(...seed_rankings) : '';

  const players = [].concat(...current_draw.opponents);
  const alt_ll = players.filter((p) => ['A', 'LL'].indexOf(p.entry) >= 0);
  alt_ll.forEach((p, i) => {
    a1[i] = entryObject(p);
    c3[i] = { text: i + 1 };
  });

  // last direct acceptance
  const da_players = players.filter((p) => ['A', 'LL', 'WC'].indexOf(p.entry) < 0);
  const da_player_rankings = [].concat(...da_players.map((p) => p.category_ranking)).sort((a, b) => a - b);
  const dalen = da_player_rankings.length;
  const damax = dalen && !isNaN(da_player_rankings[dalen - 1]) ? da_player_rankings[dalen - 1] : undefined;
  const lda_player = !damax
    ? undefined
    : da_players.reduce((p, c) => (c.category_ranking === damax ? c : p), undefined);
  lda =
    (info && info.byes && info.byes.length) || !lda_player
      ? { text: i18n.t('draws.allindraw') }
      : rankingObject(lda_player);

  const opponent_rankings = []
    .concat(...current_draw.opponents.map((o) => o.map((m) => m.category_ranking)))
    .sort((a, b) => a - b);
  const olen = opponent_rankings.length;
  const omin = olen && !isNaN(opponent_rankings[0]) ? opponent_rankings[0] : 'nr';
  const omax = olen && !isNaN(opponent_rankings[olen - 1]) ? opponent_rankings[olen - 1] : 'nr';

  if (evt.format === 'S') {
    const seeded = seeded_players.map((p) => rankingObject(p[0]));
    const s1 = seeded.slice(0, 8);
    const s2 = seeded.slice(8, 16);
    const c1 = s1.map((p, i) => ({ text: i + 1 }));
    const c2 = s2.map((p, i) => ({ text: i + 9 }));
    return { s1, s2, c1, c2, smin, smax, omin, omax, a1, c3, lda };
  } else {
    const s1 = seeded_players.map((p) => rankingObject(p[rp(p)[0]])).slice(0, 8);
    const s2 = seeded_players.map((p) => rankingObject(p[rp(p)[1]])).slice(0, 8);
    const c1 = s1.map((p, i) => ({ text: i + 1 }));
    const c2 = [];
    return { s1, s2, c1, c2, smin, smax, omin, omax, a1, c3, lda };
  }

  function rp(players) {
    const player0ranking = (players[0] && players[0].category_ranking) || 0;
    const player1ranking = (players[1] && players[1].category_ranking) || 0;
    return player0ranking < player1ranking ? [0, 1] : [1, 0];
  }
  function rankingObject(p) {
    return { text: !p ? '' : `${fullName(p)} [${p.category_ranking}]` };
  }
  function entryObject(p) {
    return { text: !p ? '' : `${fullName(p)} [${p.entry}]` };
  }
}
