/*
import { env } from 'config/defaults';
import i18n from "i18next";

import { matchRow, completedMatchRow } from 'engines/pdfEngine/matches/matchPrimitives';
import { matchesListPageHeader } from 'engines/pdfEngine/headers/matchesListHeader';
*/

export function matchesList({ tournament={}, team, type, pending_matches, completed_matches, logo }) {
   /*
  let page_header = matchesListPageHeader({ tournament, team, type, logo });

  let scheduled_header = [
     {text: i18n.t('dt'), style: 'tableHeader'}, 
     {text: i18n.t('rnd'), style: 'tableHeader'}, 
     {text: `${i18n.t('side')} 1`, style: 'tableHeader'}, 
     {text: `${i18n.t('side')} 2`, style: 'tableHeader'}, 
     {text: i18n.t('ct'), style: 'tableHeader'}, 
     {text: i18n.t('sch'), style: 'tableHeader'}
  ];

  let pending_body = [scheduled_header];
  let pending_headline = {text: i18n.t('print.pendingmatches'), fontSize: 12, bold: true, margin: [0, 20, 0, 8]};
  if (pending_matches && pending_matches.length) pending_matches.forEach(matchUp => pending_body.push(matchRow(matchUp)));
  let pending_match_block = {
     style: 'matchRows',
     table: {
        headerRows: 1,
        widths: ['auto', 'auto', '*', '*', 'auto', 'auto' ],
        body: pending_body
     },
     layout: 'headerLineOnly'
  };

  let completed_header = [
     {text: i18n.t('dt'), style: 'tableHeader'}, 
     {text: i18n.t('rnd'), style: 'tableHeader'}, 
     {text: `${i18n.t('side')} 1`, style: 'tableHeader'}, 
     {text: `${i18n.t('side')} 2`, style: 'tableHeader'}, 
     {text: '', style: 'tableHeader'}, 
     {text: i18n.t('scr'), style: 'tableHeader'}
  ];

  let completed_body = [completed_header];
  let completed_headline = {text: i18n.t('print.completedmatches'), fontSize: 12, bold: true, margin: [0, 20, 0, 8]};
  if (completed_matches && completed_matches.length) completed_matches.forEach(matchUp => completed_body.push(completedMatchRow(matchUp)));
  let completed_match_block = {
     style: 'matchRows',
     table: {
        headerRows: 1,
        widths: ['auto', 'auto', '*', '*', 'auto', 'auto' ],
        body: completed_body
     },
     layout: 'headerLineOnly'
  };


  let bodycontent = [
     pending_headline,
     pending_match_block,
     completed_headline,
     completed_match_block
  ];

  let content = [page_header, bodycontent];

  var docDefinition = {
     pageSize: env.printing.pageSize,
     pageOrientation: 'portrait',

     pageMargins: [ 10, 20, 10, 10 ],

     content,
     styles: {
        matchRows: {
           bold: false,
           fontSize: 10,
           color: 'black'
        }
     }
  };

  return { docDefinition };
  */
}

