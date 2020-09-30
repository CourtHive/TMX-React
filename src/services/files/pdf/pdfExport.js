import { tmxStore } from 'stores/tmxStore';
import { exportFx } from 'services/files/exportFx';
import { coms } from 'services/communications/SocketIo/coms';

/*
// importing makes the bundle too large
// for the future look into code-splitting to include 
// in PWA
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
*/

export function openPDF({ docDefinition }) {
  // eslint-disable-next-line
  pdfMake.createPdf(docDefinition).open();
  tmxStore.dispatch({ type: 'loading state', payload: false });
}

export function emitPDF({ docDefinition, eventId, callback }) {
  // eslint-disable-next-line
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBase64((data) => {
    coms.emitTmx({ action: 'pdf', payload: { eventId, data } }, callback);
    tmxStore.dispatch({ type: 'loading state', payload: false });
  });
}

export function savePDF({ docDefinition, filename }) {
  // eslint-disable-next-line
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBase64((data) => {
    const blob = exportFx.b64toBlob(data, 'application/pdf');
    exportFx.saveBlob(blob, filename || 'default.pdf');
    tmxStore.dispatch({ type: 'loading state', payload: false });
  });
}
