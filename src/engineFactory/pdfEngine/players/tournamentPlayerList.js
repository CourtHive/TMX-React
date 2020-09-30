import { env } from 'config/defaults';
import { context } from 'services/context';
import i18n from "i18next";
import { normalizeName } from 'normalize-text';

import { noPaddingOrBorder } from 'engineFactory/pdfEngine/layouts';

function displayYear(timestamp) {
  let date = new Date(timestamp);
  return date.getFullYear();
}

export function tournamentPlayerList({ tournament={}, players=[], attributes={}, logo, doc_name, rowsPerPage }) {
  let ratings_type = attributes.category;
  let sponsor = tournament.sponsor ? ` - ${tournament.sponsor}` : '';
  let tournament_name = `${tournament.name}${sponsor}`;
  let doubles = context.player_views.doubles_rankings;

  let empty = (x) => Array.from({length: x}, () => undefined);
  let empty_rows = rowsPerPage - (players.length % rowsPerPage);
  let rows = [].concat(...players, ...empty(empty_rows));

  let datascan = {};
  datascan.rank = players.reduce((p, c) => c.rank) ? true : false;
  datascan.rating = players.reduce((p, c) => c.ratings || p, undefined) ? true : false;
  datascan.club = players.reduce((p, c) => c.club_code || p, undefined) ? true : false;
  datascan.school = players.reduce((p, c) => c.school || p, undefined) ? true : false;
  datascan.ioc = players.reduce((p, c) => c.ioc || p, undefined) ? true : false;
  datascan.year = players.reduce((p, c) => c.birth || p, undefined) ? true : false;
  datascan.sex = players.reduce((p, c) => c.sex || p, undefined) ? true : false;

  let prototype = [ 
     { header: { text: '#', style: 'centeredTableHeader' }, row: { value: 'counter', style: 'centeredColumn' } },
     { header: { text: i18n.t('lnm'), style: 'tableHeader' }, row: { value: 'last_name' } },
     { header: { text: i18n.t('fnm'), style: 'tableHeader' }, row: { value: 'first_name' } }
  ];

  let d = datascan;
  let a = attributes;

  if (a.rank && d.rank) prototype.push({ header: { text: i18n.t('prnk'), style: 'centeredTableHeader' }, row: { value: 'rank', style: 'centeredColumn' }});
  if (a.rating && d.rating) prototype.push({ header: { text: i18n.t('rtg'), style: 'centeredTableHeader' }, row: { value: 'rating', style: 'centeredColumn' }});
  if (a.ioc && d.ioc) prototype.push({ header: { text: i18n.t('cnt'), style: 'centeredTableHeader' }, row: { value: 'ioc', style: 'centeredColumn' }});
  if (a.club && d.club) prototype.push({ header: { text: i18n.t('clb'), style: 'centeredTableHeader' }, row: { value: 'club', style: 'centeredColumn' }});
  if (a.school && d.school) prototype.push({ header: { text: i18n.t('scl'), style: 'centeredTableHeader' }, row: { value: 'school', style: 'centeredColumn' }});
  if (a.year && d.year) prototype.push({ header: { text: i18n.t('yr'), style: 'centeredTableHeader' }, row: { value: 'year', style: 'centeredColumn' }});
  if (a.sex && d.sex) prototype.push({ header: { text: i18n.t('sex'), style: 'centeredTableHeader' }, row: { value: 'sex', style: 'centeredColumn' }});

  prototype.push({ header: { text: ' ' }, row: {} });

  let column_count = prototype.length;

  let page_header = [
     { 
        border: [ false, false, false, false ],
        colSpan: column_count,
        table: {
           widths: ['auto', 'auto', '*', '*', '*', 'auto'],
           headerRows: 2,
           body: [
              [
                 { 
                    table: {
                       widths: ['*'],
                       body: [
                          [{ text: tournament_name || ' ', style: 'docTitle' }],
                          [{ text: " ", style: 'subtitle' }]
                       ]
                    },
                    colSpan: 5, 
                    layout: 'noBorders'
                 }, 
                 {}, {}, {}, {}, 
                 {
                    width: 100,
                    image: logo || '',
                    alignment: 'center'
                 }
              ],
              [ {text: doc_name || i18n.t('signin.doc_name'), colSpan: 6, style: 'docName', alignment: 'center'} ],
              [ {text: i18n.t('signin.doc_subname'), colSpan: 6, style: 'docName', alignment: 'center'} ]
           ]
        },
        layout: noPaddingOrBorder
     }
  ];

  while (page_header.length < column_count) page_header.push({});

  let blank = { border: [false, false, false, false], text: ' ' };
  let dummy = new Array(column_count).fill(blank);
  let header_row = prototype.map(p=>p.header);

  rows = rows.map((row, i) => {
     if (row) {

        let rating_value = !ratings_type || !row.ratings ? '' :
           (row.ratings[ratings_type] && row.ratings[ratings_type].singles && row.ratings[ratings_type].singles.value) || '';
        let rating = rating_value && !isNaN(rating_value) && parseFloat(rating_value) > 0 ? parseFloat(rating_value).toFixed(2) : '';

        let rank = doubles ? row.category_dbls : row.rank;

        let valz = {
           rank,
           rating,
           counter: i + 1,
           sex: row.sex,
           school: row.school,
           club: row.club_code,
           ioc: row.ioc && row.ioc.toUpperCase(),
           year: row.birth && displayYear(row.birth),
           last_name: row.last_name && row.last_name.toUpperCase().trim(),
           first_name: row.first_name && normalizeName(row.first_name, false)
        };
        return prototype.map(p => ({ text: valz[p.row.value] || ' ', style: p.row.style }));
     } else {
        return dummy;
     }
  }).filter(f=>f);

  let player_rows = [].concat([page_header], [dummy], [header_row], rows);
  let table_rows = {
     fontSize: 10,
     table: {
        headerRows: 3,
        widths: new Array(column_count - 1).fill('auto').concat('*'),
        body: player_rows
     },
     layout: 'noBorders'
  };

  var docDefinition = {
     pageSize: env.printing.pageSize,
     pageOrientation: 'portrait',

     content: [
        table_rows
     ],

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

